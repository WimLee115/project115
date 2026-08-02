import { sql, relations } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  real,
  index,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

/*
 * Project115 — databaseschema
 *
 * Ontwerpprincipes:
 * 1. Tweetaligheid zit in het datamodel, niet in een vertaallaag erboven.
 *    Elke inhoudelijke tekst heeft een `_nl`- en `_en`-kolom, zodat je
 *    tijdens een examen van taal kunt wisselen zonder de vraag te verliezen.
 * 2. Elke vraag hangt aan precies één assessment-criterium (`objective`).
 *    Dat maakt zwakke-plek-analyse per leerdoel exact in plaats van globaal.
 * 3. Antwoorden worden onveranderlijk vastgelegd per poging. Ook als een vraag
 *    later wordt gecorrigeerd, blijft een oud examenrapport reproduceerbaar.
 * 4. Alle tijdstempels zijn Unix-seconden (integer) in UTC.
 */

const now = sql`(unixepoch())`;

/* ---------------------------------------------------------------------------
 * Identiteit en sessies
 * ------------------------------------------------------------------------- */

export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    /** Argon2id-hash. Bevat salt en parameters; nooit apart opslaan. */
    passwordHash: text('password_hash').notNull(),
    displayName: text('display_name').notNull(),
    /** Voorkeurstaal van de interface: 'nl' of 'en'. */
    locale: text('locale', { enum: ['nl', 'en'] }).notNull().default('nl'),
    /** AES-256-GCM-versleuteld TOTP-secret; null als 2FA uit staat. */
    totpSecret: text('totp_secret'),
    totpEnabledAt: integer('totp_enabled_at'),
    /** Eenmalige herstelcodes (Argon2id-hashes, JSON-array). */
    recoveryCodes: text('recovery_codes'),
    /** Brute-force-rem: opeenvolgende mislukte pogingen. */
    failedLoginCount: integer('failed_login_count').notNull().default(0),
    lockedUntil: integer('locked_until'),
    lastLoginAt: integer('last_login_at'),
    createdAt: integer('created_at').notNull().default(now),
    updatedAt: integer('updated_at').notNull().default(now),
  },
  (t) => [uniqueIndex('users_email_unique').on(t.email)],
);

export const sessions = sqliteTable(
  'sessions',
  {
    /** SHA-256 van het sessietoken. Het token zelf staat alleen in de cookie. */
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    /** Verloopt bij inactiviteit; wordt verlengd bij gebruik. */
    expiresAt: integer('expires_at').notNull(),
    /** Harde bovengrens, wordt nooit verlengd. Beperkt sessiediefstal. */
    absoluteExpiresAt: integer('absolute_expires_at').notNull(),
    /** Gehasht, zodat een databaselek geen IP-geschiedenis prijsgeeft. */
    ipHash: text('ip_hash'),
    userAgent: text('user_agent'),
    /** Pas true na een geslaagde tweede factor (als 2FA aan staat). */
    mfaSatisfied: integer('mfa_satisfied', { mode: 'boolean' })
      .notNull()
      .default(true),
    createdAt: integer('created_at').notNull().default(now),
  },
  (t) => [
    index('sessions_user_idx').on(t.userId),
    index('sessions_expiry_idx').on(t.expiresAt),
  ],
);

/** Append-only logboek voor beveiligingsrelevante gebeurtenissen. */
export const auditLog = sqliteTable(
  'audit_log',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    event: text('event').notNull(),
    outcome: text('outcome', { enum: ['success', 'failure'] }).notNull(),
    ipHash: text('ip_hash'),
    userAgent: text('user_agent'),
    /** Vrije JSON-context, nooit wachtwoorden of tokens. */
    meta: text('meta'),
    createdAt: integer('created_at').notNull().default(now),
  },
  (t) => [
    index('audit_user_idx').on(t.userId),
    index('audit_created_idx').on(t.createdAt),
  ],
);

/** Persistente rate limiting: overleeft een herstart, anders is de rem zinloos. */
export const rateLimits = sqliteTable(
  'rate_limits',
  {
    key: text('key').primaryKey(),
    count: integer('count').notNull().default(0),
    windowStart: integer('window_start').notNull(),
    blockedUntil: integer('blocked_until'),
  },
  (t) => [index('rate_limits_window_idx').on(t.windowStart)],
);

/* ---------------------------------------------------------------------------
 * Examenstructuur: certificering → domein → leerdoel → vraag
 * ------------------------------------------------------------------------- */

export const certifications = sqliteTable('certifications', {
  /** Slug, bijv. 'itil5-foundation'. */
  id: text('id').primaryKey(),
  provider: text('provider').notNull(),
  titleNl: text('title_nl').notNull(),
  titleEn: text('title_en').notNull(),
  descriptionNl: text('description_nl').notNull(),
  descriptionEn: text('description_en').notNull(),
  /** Aantal vragen in het echte examen. */
  questionCount: integer('question_count').notNull(),
  /** Aantal goede antwoorden dat nodig is om te slagen. */
  passMark: integer('pass_mark').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  /** Extra tijd voor niet-moedertaalsprekers, in minuten (PeopleCert: +25%). */
  extraTimeMinutes: integer('extra_time_minutes').notNull().default(0),
  /** Officiële examentaal, relevant omdat oefenen in die taal het meest lijkt op het echte examen. */
  examLanguage: text('exam_language', { enum: ['nl', 'en'] }).notNull(),
  accentColor: text('accent_color').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

/** Examengebied met officiële weging, bijv. 'ITIL Value System' = 40%. */
export const domains = sqliteTable(
  'domains',
  {
    id: text('id').primaryKey(),
    certificationId: text('certification_id')
      .notNull()
      .references(() => certifications.id, { onDelete: 'cascade' }),
    /** Officiële nummering, bijv. '4'. */
    code: text('code').notNull(),
    titleNl: text('title_nl').notNull(),
    titleEn: text('title_en').notNull(),
    /** Weging in procenten; bepaalt hoeveel vragen een proefexamen hieruit trekt. */
    weight: real('weight').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('domains_cert_idx').on(t.certificationId)],
);

/** Eén assessment-criterium, bijv. ITIL 4.2.2 of ISFS 3.5.4. */
export const objectives = sqliteTable(
  'objectives',
  {
    id: text('id').primaryKey(),
    domainId: text('domain_id')
      .notNull()
      .references(() => domains.id, { onDelete: 'cascade' }),
    certificationId: text('certification_id')
      .notNull()
      .references(() => certifications.id, { onDelete: 'cascade' }),
    code: text('code').notNull(),
    /** Onderwerp waar dit criterium onder valt, bijv. '4.2 The ITIL Guiding Principles'. */
    topicNl: text('topic_nl').notNull(),
    topicEn: text('topic_en').notNull(),
    descriptionNl: text('description_nl').notNull(),
    descriptionEn: text('description_en').notNull(),
    /** Bloom-niveau: 1 = onthouden/herkennen, 2 = begrijpen/toepassen. */
    bloomLevel: integer('bloom_level').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [
    index('objectives_domain_idx').on(t.domainId),
    index('objectives_cert_idx').on(t.certificationId),
    uniqueIndex('objectives_cert_code_unique').on(t.certificationId, t.code),
  ],
);

/* ---------------------------------------------------------------------------
 * Vragen
 * ------------------------------------------------------------------------- */

/**
 * Vraagtypes volgens de PeopleCert-syllabus:
 * - standard      : stem + vier opties, één juist
 * - negative       : stem is ontkennend geformuleerd (welke is NIET ...)
 * - missing_word   : zin met ontbrekend woord, vier kandidaten
 * - list           : vier genummerde statements, kies de twee juiste
 *                    (de opties zijn combinaties zoals '1 en 2')
 */
export const questions = sqliteTable(
  'questions',
  {
    id: text('id').primaryKey(),
    certificationId: text('certification_id')
      .notNull()
      .references(() => certifications.id, { onDelete: 'cascade' }),
    objectiveId: text('objective_id')
      .notNull()
      .references(() => objectives.id, { onDelete: 'cascade' }),
    type: text('type', {
      enum: ['standard', 'negative', 'missing_word', 'list'],
    })
      .notNull()
      .default('standard'),
    bloomLevel: integer('bloom_level').notNull().default(1),
    /** 1 = makkelijk, 2 = gemiddeld, 3 = lastig. Alleen voor eigen sturing. */
    difficulty: integer('difficulty').notNull().default(2),
    stemNl: text('stem_nl').notNull(),
    stemEn: text('stem_en').notNull(),
    /**
     * Alleen bij type 'list': JSON-array van vier statements
     * ({ nl: string; en: string }[]). Null bij de andere types.
     */
    listItems: text('list_items'),
    /** Waarom het juiste antwoord juist is; verschijnt na beantwoorden. */
    explanationNl: text('explanation_nl').notNull(),
    explanationEn: text('explanation_en').notNull(),
    /** Verwijzing naar het bronmateriaal, bijv. 'Syllabus 4.2.2'. */
    sourceRef: text('source_ref'),
    /** Uit de roulatie halen zonder historie te verliezen. */
    active: integer('active', { mode: 'boolean' }).notNull().default(true),
    /** 'seed' voor meegeleverde vragen, 'user' voor zelf toegevoegde. */
    origin: text('origin', { enum: ['seed', 'user', 'import'] })
      .notNull()
      .default('seed'),
    createdAt: integer('created_at').notNull().default(now),
    updatedAt: integer('updated_at').notNull().default(now),
  },
  (t) => [
    index('questions_cert_idx').on(t.certificationId),
    index('questions_objective_idx').on(t.objectiveId),
    index('questions_active_idx').on(t.active),
  ],
);

export const questionOptions = sqliteTable(
  'question_options',
  {
    id: text('id').primaryKey(),
    questionId: text('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    /** 'A' t/m 'D'. */
    label: text('label').notNull(),
    textNl: text('text_nl').notNull(),
    textEn: text('text_en').notNull(),
    isCorrect: integer('is_correct', { mode: 'boolean' })
      .notNull()
      .default(false),
    /**
     * Waarom deze afleider fout is. Het verschil tussen leren en gokken zit
     * hier: begrijpen waarom drie opties niet kloppen.
     */
    rationaleNl: text('rationale_nl'),
    rationaleEn: text('rationale_en'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [index('options_question_idx').on(t.questionId)],
);

/* ---------------------------------------------------------------------------
 * Pogingen en antwoorden
 * ------------------------------------------------------------------------- */

export const attempts = sqliteTable(
  'attempts',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    certificationId: text('certification_id')
      .notNull()
      .references(() => certifications.id, { onDelete: 'cascade' }),
    /**
     * exam     : volledig proefexamen onder examencondities
     * practice : oefenen met directe feedback
     * weakspot : gerichte sessie op de zwakste leerdoelen
     * review   : herhaling uit de spaced-repetition-wachtrij
     */
    mode: text('mode', {
      enum: ['exam', 'practice', 'weakspot', 'review'],
    }).notNull(),
    locale: text('locale', { enum: ['nl', 'en'] }).notNull(),
    startedAt: integer('started_at').notNull().default(now),
    finishedAt: integer('finished_at'),
    /** Null in oefenmodus (geen tijdslimiet). */
    timeLimitSeconds: integer('time_limit_seconds'),
    /** True als extra tijd voor niet-moedertaalsprekers is toegepast. */
    extraTimeApplied: integer('extra_time_applied', { mode: 'boolean' })
      .notNull()
      .default(false),
    questionCount: integer('question_count').notNull(),
    /** Aantal goede antwoorden; null zolang de poging loopt. */
    score: integer('score'),
    passMark: integer('pass_mark').notNull(),
    passed: integer('passed', { mode: 'boolean' }),
    /** True als de tijd verstreek voordat er werd ingeleverd. */
    autoSubmitted: integer('auto_submitted', { mode: 'boolean' })
      .notNull()
      .default(false),
  },
  (t) => [
    index('attempts_user_idx').on(t.userId),
    index('attempts_cert_idx').on(t.certificationId),
    index('attempts_started_idx').on(t.startedAt),
  ],
);

export const attemptQuestions = sqliteTable(
  'attempt_questions',
  {
    id: text('id').primaryKey(),
    attemptId: text('attempt_id')
      .notNull()
      .references(() => attempts.id, { onDelete: 'cascade' }),
    questionId: text('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    /** Kopie van het leerdoel, zodat statistiek blijft kloppen na wijzigingen. */
    objectiveId: text('objective_id').notNull(),
    position: integer('position').notNull(),
    /**
     * Volgorde waarin de opties zijn getoond, als JSON-array van option-id's.
     * Door te husselen leer je het antwoord, niet de positie ervan.
     */
    optionOrder: text('option_order').notNull(),
    /** Gekozen option-id, of null als niet beantwoord. */
    selectedOptionId: text('selected_option_id'),
    isCorrect: integer('is_correct', { mode: 'boolean' }),
    /** Gemarkeerd om later op terug te komen (zoals in het echte examen). */
    flagged: integer('flagged', { mode: 'boolean' }).notNull().default(false),
    timeSpentMs: integer('time_spent_ms').notNull().default(0),
    answeredAt: integer('answered_at'),
  },
  (t) => [
    index('aq_attempt_idx').on(t.attemptId),
    index('aq_question_idx').on(t.questionId),
    index('aq_objective_idx').on(t.objectiveId),
    uniqueIndex('aq_attempt_position_unique').on(t.attemptId, t.position),
  ],
);

/* ---------------------------------------------------------------------------
 * Spaced repetition (FSRS)
 * ------------------------------------------------------------------------- */

/**
 * Eén kaart per gebruiker per item. `itemType` maakt het model geschikt voor
 * zowel examenvragen als begrippen uit het glossarium.
 */
export const fsrsCards = sqliteTable(
  'fsrs_cards',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    itemType: text('item_type', { enum: ['question', 'term'] }).notNull(),
    itemId: text('item_id').notNull(),
    certificationId: text('certification_id').notNull(),
    /** Wanneer deze kaart weer aan bod moet komen (Unix-seconden). */
    due: integer('due').notNull(),
    /** FSRS-geheugentoestand. */
    stability: real('stability').notNull().default(0),
    difficulty: real('difficulty').notNull().default(0),
    elapsedDays: real('elapsed_days').notNull().default(0),
    scheduledDays: real('scheduled_days').notNull().default(0),
    reps: integer('reps').notNull().default(0),
    lapses: integer('lapses').notNull().default(0),
    /** 0 = New, 1 = Learning, 2 = Review, 3 = Relearning. */
    state: integer('state').notNull().default(0),
    lastReview: integer('last_review'),
    /** Handmatig uitgezet, bijv. omdat je een begrip al beheerst. */
    suspended: integer('suspended', { mode: 'boolean' })
      .notNull()
      .default(false),
  },
  (t) => [
    uniqueIndex('fsrs_user_item_unique').on(t.userId, t.itemType, t.itemId),
    index('fsrs_due_idx').on(t.userId, t.due),
    index('fsrs_cert_idx').on(t.certificationId),
  ],
);

export const fsrsReviews = sqliteTable(
  'fsrs_reviews',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    cardId: text('card_id')
      .notNull()
      .references(() => fsrsCards.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    /** FSRS-beoordeling: 1 = Again, 2 = Hard, 3 = Good, 4 = Easy. */
    rating: integer('rating').notNull(),
    state: integer('state').notNull(),
    /** Geplande interval in dagen ná deze review. */
    scheduledDays: real('scheduled_days').notNull(),
    elapsedDays: real('elapsed_days').notNull(),
    reviewedAt: integer('reviewed_at').notNull().default(now),
    durationMs: integer('duration_ms').notNull().default(0),
  },
  (t) => [
    index('fsrs_reviews_card_idx').on(t.cardId),
    index('fsrs_reviews_user_idx').on(t.userId, t.reviewedAt),
  ],
);

/* ---------------------------------------------------------------------------
 * Glossarium
 * ------------------------------------------------------------------------- */

export const glossaryTerms = sqliteTable(
  'glossary_terms',
  {
    id: text('id').primaryKey(),
    certificationId: text('certification_id')
      .notNull()
      .references(() => certifications.id, { onDelete: 'cascade' }),
    /** Optionele koppeling aan een leerdoel voor gerichte herhaling. */
    objectiveId: text('objective_id').references(() => objectives.id, {
      onDelete: 'set null',
    }),
    termEn: text('term_en').notNull(),
    termNl: text('term_nl').notNull(),
    definitionNl: text('definition_nl').notNull(),
    definitionEn: text('definition_en').notNull(),
    /** Veelgemaakte verwarring, bijv. 'niet te verwarren met een probleem'. */
    noteNl: text('note_nl'),
    noteEn: text('note_en'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [
    index('glossary_cert_idx').on(t.certificationId),
    index('glossary_term_idx').on(t.termEn),
  ],
);

/* ---------------------------------------------------------------------------
 * Gebruikersinstellingen per certificering
 * ------------------------------------------------------------------------- */

export const studyPlans = sqliteTable(
  'study_plans',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    certificationId: text('certification_id')
      .notNull()
      .references(() => certifications.id, { onDelete: 'cascade' }),
    /** Geplande examendatum (Unix-seconden), voor de aftelling op het dashboard. */
    examDate: integer('exam_date'),
    /** Dagelijks doel: aantal herhalingen. */
    dailyReviewTarget: integer('daily_review_target').notNull().default(30),
    /** Standaard extra tijd toepassen bij proefexamens. */
    useExtraTime: integer('use_extra_time', { mode: 'boolean' })
      .notNull()
      .default(false),
    /** Voorkeurstaal om in te oefenen voor deze certificering. */
    preferredLocale: text('preferred_locale', { enum: ['nl', 'en'] })
      .notNull()
      .default('nl'),
    createdAt: integer('created_at').notNull().default(now),
    updatedAt: integer('updated_at').notNull().default(now),
  },
  (t) => [
    uniqueIndex('study_plans_user_cert_unique').on(t.userId, t.certificationId),
  ],
);

/* ---------------------------------------------------------------------------
 * Relaties
 * ------------------------------------------------------------------------- */

export const certificationsRelations = relations(certifications, ({ many }) => ({
  domains: many(domains),
  objectives: many(objectives),
  questions: many(questions),
  glossaryTerms: many(glossaryTerms),
}));

export const domainsRelations = relations(domains, ({ one, many }) => ({
  certification: one(certifications, {
    fields: [domains.certificationId],
    references: [certifications.id],
  }),
  objectives: many(objectives),
}));

export const objectivesRelations = relations(objectives, ({ one, many }) => ({
  domain: one(domains, {
    fields: [objectives.domainId],
    references: [domains.id],
  }),
  certification: one(certifications, {
    fields: [objectives.certificationId],
    references: [certifications.id],
  }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  certification: one(certifications, {
    fields: [questions.certificationId],
    references: [certifications.id],
  }),
  objective: one(objectives, {
    fields: [questions.objectiveId],
    references: [objectives.id],
  }),
  options: many(questionOptions),
}));

export const questionOptionsRelations = relations(questionOptions, ({ one }) => ({
  question: one(questions, {
    fields: [questionOptions.questionId],
    references: [questions.id],
  }),
}));

export const attemptsRelations = relations(attempts, ({ one, many }) => ({
  user: one(users, { fields: [attempts.userId], references: [users.id] }),
  certification: one(certifications, {
    fields: [attempts.certificationId],
    references: [certifications.id],
  }),
  items: many(attemptQuestions),
}));

export const attemptQuestionsRelations = relations(
  attemptQuestions,
  ({ one }) => ({
    attempt: one(attempts, {
      fields: [attemptQuestions.attemptId],
      references: [attempts.id],
    }),
    question: one(questions, {
      fields: [attemptQuestions.questionId],
      references: [questions.id],
    }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  attempts: many(attempts),
  cards: many(fsrsCards),
  plans: many(studyPlans),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const fsrsCardsRelations = relations(fsrsCards, ({ one, many }) => ({
  user: one(users, { fields: [fsrsCards.userId], references: [users.id] }),
  reviews: many(fsrsReviews),
}));

/* ---------------------------------------------------------------------------
 * Afgeleide types
 * ------------------------------------------------------------------------- */

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Certification = typeof certifications.$inferSelect;
export type Domain = typeof domains.$inferSelect;
export type Objective = typeof objectives.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type QuestionOption = typeof questionOptions.$inferSelect;
export type Attempt = typeof attempts.$inferSelect;
export type AttemptQuestion = typeof attemptQuestions.$inferSelect;
export type FsrsCard = typeof fsrsCards.$inferSelect;
export type GlossaryTerm = typeof glossaryTerms.$inferSelect;
export type StudyPlan = typeof studyPlans.$inferSelect;

export type Locale = 'nl' | 'en';
export type QuestionType = Question['type'];
export type AttemptMode = Attempt['mode'];
