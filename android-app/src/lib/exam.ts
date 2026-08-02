import { allocateByWeight, createRandom, shuffle } from './allocation';
import {
  getCertification,
  getQuestion,
  getObjective,
  getDomainByCode,
  questionsFor,
  domainsFor,
  pick,
  pickAlt,
  type ContentQuestion,
  type Locale,
} from './content';
import { newId } from './id';
import { recordAnswerAsReview } from './srs';
import {
  createAttempt,
  deleteAttempt,
  finishAttempt,
  getAttempt,
  itemsOfAttempt,
  putAttemptQuestion,
  allAttempts,
  allAttemptQuestions,
  type AttemptMode,
  type AttemptRow,
  type AttemptQuestionRow,
} from './store';

/**
 * Proefexamens en oefensessies.
 *
 * Dit bestand vervangt drie dingen uit de webversie in één: het samenstellen
 * van een examen (`lib/exam/generate.ts`), het laden ervan (`lib/exam/load.ts`)
 * en de serveracties eromheen (`app/actions/exam.ts`).
 *
 * Eén ding is principieel anders. In de webversie houdt de server het juiste
 * antwoord achter tot na het inleveren, zodat de client er niet bij kan. Hier
 * is er geen server: de vragenbank zit in de app, dus wie wil kan het antwoord
 * altijd vinden. Dat is geen zwakte om te verbergen maar een eigenschap van een
 * offline app — de enige die je hier voor de gek zou houden ben je zelf, en
 * daar heeft je examen niets aan. De examenmodus toont dus nog steeds geen
 * feedback vóór het inleveren, maar dat is nu een ontwerpkeuze in de weergave
 * in plaats van een beveiligingsgrens.
 */

export interface GeneratedQuestion {
  questionId: string;
  objectiveId: string;
  optionOrder: string[];
}

export interface GenerateOptions {
  certificationId: string;
  count?: number;
  /** Recent geziene vragen; worden alleen gebruikt als er anders te weinig zijn. */
  excludeQuestionIds?: string[];
  objectiveIds?: string[];
  /** Deterministische selectie voor tests. */
  seed?: number;
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Stelt een examen samen met de officiële domeinverdeling.
 *
 * Wanneer een domein onvoldoende vragen heeft, wordt het tekort aangevuld uit
 * de overige domeinen. Dat is beter dan een korter examen: je oefent nog
 * steeds met het juiste aantal vragen onder dezelfde tijdsdruk.
 */
export function generateExam(options: GenerateOptions): GeneratedQuestion[] {
  const random = createRandom(options.seed);

  const certification = getCertification(options.certificationId);
  if (!certification) {
    throw new Error(`Onbekende certificering: ${options.certificationId}`);
  }

  const total = options.count ?? certification.questionCount;
  const objectiveFilter = options.objectiveIds?.length
    ? new Set(options.objectiveIds)
    : null;

  const rows = questionsFor(options.certificationId).filter(
    (question) => !objectiveFilter || objectiveFilter.has(question.objectiveId),
  );

  if (rows.length === 0) return [];

  const excluded = new Set(options.excludeQuestionIds ?? []);
  const domainRows = domainsFor(options.certificationId);

  // Bij een gerichte oefensessie op één leerdoel is de domeinverdeling niet
  // zinvol; dan is een simpele greep uit de beschikbare vragen correct.
  const useWeights = !objectiveFilter && domainRows.length > 0;

  const byDomain = new Map<string, ContentQuestion[]>();
  for (const row of rows) {
    const list = byDomain.get(row.domainCode) ?? [];
    list.push(row);
    byDomain.set(row.domainCode, list);
  }

  const picked: ContentQuestion[] = [];
  const usedIds = new Set<string>();

  if (useWeights) {
    const allocation = allocateByWeight(domainRows, total);

    for (const [code, wanted] of allocation) {
      const available = byDomain.get(code) ?? [];
      // Recent geziene vragen achteraan, zodat variatie voorrang krijgt maar
      // een klein domein toch gevuld kan worden.
      const ordered = [
        ...shuffle(available.filter((q) => !excluded.has(q.id)), random),
        ...shuffle(available.filter((q) => excluded.has(q.id)), random),
      ];
      for (const question of ordered.slice(0, wanted)) {
        picked.push(question);
        usedIds.add(question.id);
      }
    }
  }

  // Aanvullen tot het gewenste aantal wanneer domeinen te weinig vragen hadden,
  // of wanneer we zonder weging werken.
  if (picked.length < total) {
    const remaining = [
      ...shuffle(rows.filter((q) => !usedIds.has(q.id) && !excluded.has(q.id)), random),
      ...shuffle(rows.filter((q) => !usedIds.has(q.id) && excluded.has(q.id)), random),
    ];
    for (const question of remaining) {
      if (picked.length >= total) break;
      picked.push(question);
      usedIds.add(question.id);
    }
  }

  const finalQuestions = shuffle(picked, random).slice(0, total);

  // Optievolgorde per vraag husselen. Bij 'list'-vragen blijven de opties in
  // hun oorspronkelijke volgorde staan: die verwijzen naar genummerde
  // statements ('1 en 2'), waardoor husselen de vraag onlogisch zou maken.
  return finalQuestions.map((question) => {
    const ids = [...question.options]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((option) => option.id);

    return {
      questionId: question.id,
      objectiveId: question.objectiveId,
      optionOrder: question.type === 'list' ? ids : shuffle(ids, random),
    };
  });
}

/** Vragen die recent zijn gezien, om herhaling in een nieuw examen te beperken. */
export async function getRecentlySeenQuestionIds(
  certificationId: string,
  limit = 80,
): Promise<string[]> {
  const attempts = await allAttempts();
  const relevant = new Set(
    attempts
      .filter((attempt) => attempt.certificationId === certificationId)
      .map((attempt) => attempt.id),
  );
  if (relevant.size === 0) return [];

  const items = await allAttemptQuestions();
  const byAttempt = new Map<string, string[]>();
  for (const item of items) {
    if (!relevant.has(item.attemptId)) continue;
    const list = byAttempt.get(item.attemptId);
    if (list) list.push(item.questionId);
    else byAttempt.set(item.attemptId, [item.questionId]);
  }

  const seen: string[] = [];
  const unique = new Set<string>();

  // Nieuwste pogingen eerst; `allAttempts` sorteert daar al op.
  for (const attempt of attempts) {
    for (const questionId of byAttempt.get(attempt.id) ?? []) {
      if (unique.has(questionId)) continue;
      unique.add(questionId);
      seen.push(questionId);
      if (seen.length >= limit) return seen;
    }
  }

  return seen;
}

/* ---------------------------------------------------------------------------
 * Een poging starten
 * ------------------------------------------------------------------------- */

export interface StartOptions {
  certificationId: string;
  mode: AttemptMode;
  locale: Locale;
  extraTime?: boolean;
  count?: number;
  objectiveIds?: string[];
}

/**
 * Start een poging, of geeft de lopende terug.
 *
 * Een tweede poging naast een lopende zou je voortgang stilletjes laten
 * verdwijnen door één verkeerde tik; hervatten is bijna altijd wat je bedoelde.
 */
export async function startAttempt(
  options: StartOptions,
): Promise<{ attemptId: string; resumed: boolean }> {
  const certification = getCertification(options.certificationId);
  if (!certification) throw new Error('Onbekende certificering.');

  const attempts = await allAttempts();
  const open = attempts.find(
    (attempt) =>
      attempt.certificationId === options.certificationId &&
      attempt.finishedAt === null,
  );
  if (open) return { attemptId: open.id, resumed: true };

  const questionCount =
    options.count ??
    (options.mode === 'exam'
      ? certification.questionCount
      : Math.min(20, certification.questionCount));

  const recentlySeen =
    options.mode === 'exam'
      ? await getRecentlySeenQuestionIds(options.certificationId)
      : [];

  const generated = generateExam({
    certificationId: options.certificationId,
    count: questionCount,
    excludeQuestionIds: recentlySeen,
    ...(options.objectiveIds?.length ? { objectiveIds: options.objectiveIds } : {}),
  });

  if (generated.length === 0) throw new Error('Geen vragen beschikbaar.');

  const extraTime = options.extraTime === true;
  const timeLimitSeconds =
    options.mode === 'exam'
      ? (certification.durationMinutes +
          (extraTime ? certification.extraTimeMinutes : 0)) *
        60
      : null;

  const attemptId = newId('att');

  const attempt: AttemptRow = {
    id: attemptId,
    certificationId: options.certificationId,
    mode: options.mode,
    locale: options.locale,
    startedAt: nowSeconds(),
    finishedAt: null,
    timeLimitSeconds,
    extraTimeApplied: options.mode === 'exam' && extraTime,
    questionCount: generated.length,
    score: null,
    passMark:
      options.mode === 'exam'
        ? certification.passMark
        : // Bij kortere sessies de cesuur naar rato meeschalen.
          Math.ceil(
            (certification.passMark / certification.questionCount) * generated.length,
          ),
    passed: null,
    autoSubmitted: false,
  };

  const items: AttemptQuestionRow[] = generated.map((item, index) => ({
    id: newId('aq'),
    attemptId,
    questionId: item.questionId,
    objectiveId: item.objectiveId,
    position: index,
    optionOrder: item.optionOrder,
    selectedOptionId: null,
    isCorrect: null,
    flagged: false,
    timeSpentMs: 0,
    answeredAt: null,
  }));

  await createAttempt(attempt, items);

  return { attemptId, resumed: false };
}

/* ---------------------------------------------------------------------------
 * Een poging laden
 * ------------------------------------------------------------------------- */

export interface LoadedOption {
  id: string;
  label: string;
  text: string;
  textAlt: string;
  isCorrect: boolean;
  rationale: string | null;
}

export interface LoadedQuestion {
  position: number;
  questionId: string;
  type: string;
  bloomLevel: number;
  stem: string;
  stemAlt: string;
  listItems: Array<{ text: string; textAlt: string }> | null;
  options: LoadedOption[];
  selectedOptionId: string | null;
  flagged: boolean;
  isCorrect: boolean | null;
  objectiveCode: string;
  objectiveDescription: string;
  domainCode: string;
  domainTitle: string;
  explanation: string;
  sourceRef: string | null;
}

export interface LoadedAttempt {
  id: string;
  certificationId: string;
  certificationTitle: string;
  accentColor: string;
  mode: AttemptMode;
  locale: Locale;
  startedAt: number;
  finishedAt: number | null;
  timeLimitSeconds: number | null;
  extraTimeApplied: boolean;
  questionCount: number;
  passMark: number;
  score: number | null;
  passed: boolean | null;
  autoSubmitted: boolean;
  questions: LoadedQuestion[];
}

export async function loadAttempt(attemptId: string): Promise<LoadedAttempt | null> {
  const attempt = await getAttempt(attemptId);
  if (!attempt) return null;

  const certification = getCertification(attempt.certificationId);
  if (!certification) return null;

  const items = await itemsOfAttempt(attemptId);
  const locale = attempt.locale;

  const questions: LoadedQuestion[] = [];

  for (const item of items) {
    const question = getQuestion(item.questionId);
    // Een vraag die uit de vragenbank is verdwenen na een contentwijziging
    // overslaan is beter dan het hele rapport laten breken.
    if (!question) continue;

    const objective = getObjective(question.objectiveId);
    const domain = getDomainByCode(question.certificationId, question.domainCode);
    const byId = new Map(question.options.map((option) => [option.id, option]));

    // Volg de opgeslagen volgorde; opties die niet meer bestaan overslaan.
    const ordered = item.optionOrder
      .map((id) => byId.get(id))
      .filter((option): option is NonNullable<typeof option> => option !== undefined);

    const labels = ['A', 'B', 'C', 'D'];

    questions.push({
      position: item.position,
      questionId: question.id,
      type: question.type,
      bloomLevel: question.bloomLevel,
      stem: pick(locale, question.stemNl, question.stemEn),
      stemAlt: pickAlt(locale, question.stemNl, question.stemEn),
      listItems:
        question.listItems?.map((li) => ({
          text: pick(locale, li.nl, li.en),
          textAlt: pickAlt(locale, li.nl, li.en),
        })) ?? null,
      options: ordered.map((option, index) => ({
        id: option.id,
        label: labels[index] ?? String.fromCharCode(65 + index),
        text: pick(locale, option.textNl, option.textEn),
        textAlt: pickAlt(locale, option.textNl, option.textEn),
        isCorrect: option.isCorrect,
        rationale: locale === 'nl' ? option.rationaleNl : option.rationaleEn,
      })),
      selectedOptionId: item.selectedOptionId,
      flagged: item.flagged,
      isCorrect: item.isCorrect,
      objectiveCode: objective?.code ?? '',
      objectiveDescription: objective
        ? pick(locale, objective.descriptionNl, objective.descriptionEn)
        : '',
      domainCode: question.domainCode,
      domainTitle: domain ? pick(locale, domain.titleNl, domain.titleEn) : '',
      explanation: pick(locale, question.explanationNl, question.explanationEn),
      sourceRef: question.sourceRef,
    });
  }

  return {
    id: attempt.id,
    certificationId: attempt.certificationId,
    certificationTitle: pick(locale, certification.titleNl, certification.titleEn),
    accentColor: certification.accentColor,
    mode: attempt.mode,
    locale,
    startedAt: attempt.startedAt,
    finishedAt: attempt.finishedAt,
    timeLimitSeconds: attempt.timeLimitSeconds,
    extraTimeApplied: attempt.extraTimeApplied,
    questionCount: attempt.questionCount,
    passMark: attempt.passMark,
    score: attempt.score,
    passed: attempt.passed,
    autoSubmitted: attempt.autoSubmitted,
    questions,
  };
}

/* ---------------------------------------------------------------------------
 * Antwoorden
 * ------------------------------------------------------------------------- */

export interface AnswerFeedback {
  correct: boolean;
  correctOptionId: string;
  explanation: string;
  rationales: Record<string, string | null>;
}

export interface AnswerResult {
  ok: boolean;
  error?: string;
  /** Alleen gevuld buiten de examenmodus. */
  feedback?: AnswerFeedback;
}

export async function saveAnswer(input: {
  attemptId: string;
  position: number;
  optionId: string | null;
  timeSpentMs?: number;
}): Promise<AnswerResult> {
  const attempt = await getAttempt(input.attemptId);
  if (!attempt) return { ok: false, error: 'Poging niet gevonden.' };
  if (attempt.finishedAt !== null) {
    return { ok: false, error: 'Deze poging is al afgerond.' };
  }

  // Na de tijdslimiet worden geen antwoorden meer aangenomen, ook niet als de
  // timer in beeld iets anders suggereert.
  if (attempt.timeLimitSeconds !== null) {
    const elapsed = nowSeconds() - attempt.startedAt;
    if (elapsed > attempt.timeLimitSeconds + 5) {
      return { ok: false, error: 'De tijd is verstreken.' };
    }
  }

  const items = await itemsOfAttempt(input.attemptId);
  const item = items.find((row) => row.position === input.position);
  if (!item) return { ok: false, error: 'Vraag niet gevonden.' };

  const question = getQuestion(item.questionId);
  if (!question) return { ok: false, error: 'Vraag bestaat niet meer.' };

  const chosen = input.optionId
    ? question.options.find((option) => option.id === input.optionId)
    : null;
  if (input.optionId && !chosen) {
    return { ok: false, error: 'Ongeldige antwoordoptie.' };
  }

  const isCorrect = chosen ? chosen.isCorrect : null;
  const timeSpentMs = Math.min(input.timeSpentMs ?? 0, 3_600_000);

  await putAttemptQuestion({
    ...item,
    selectedOptionId: input.optionId,
    isCorrect,
    timeSpentMs: item.timeSpentMs + timeSpentMs,
    answeredAt: input.optionId ? nowSeconds() : null,
  });

  if (attempt.mode === 'exam') {
    // Geen terugkoppeling tijdens een proefexamen.
    return { ok: true };
  }

  // Buiten de examenmodus telt het antwoord direct mee voor het herhaalschema.
  if (input.optionId !== null && isCorrect !== null) {
    await recordAnswerAsReview(
      item.questionId,
      attempt.certificationId,
      isCorrect,
      timeSpentMs,
    );
  }

  const correctOption = question.options.find((option) => option.isCorrect);
  const locale = attempt.locale;

  return {
    ok: true,
    feedback: {
      correct: isCorrect === true,
      correctOptionId: correctOption?.id ?? '',
      explanation: pick(locale, question.explanationNl, question.explanationEn),
      rationales: Object.fromEntries(
        question.options.map((option) => [
          option.id,
          locale === 'nl' ? option.rationaleNl : option.rationaleEn,
        ]),
      ),
    },
  };
}

export async function toggleFlag(input: {
  attemptId: string;
  position: number;
}): Promise<{ ok: boolean; flagged?: boolean }> {
  const items = await itemsOfAttempt(input.attemptId);
  const item = items.find((row) => row.position === input.position);
  if (!item) return { ok: false };

  const flagged = !item.flagged;
  await putAttemptQuestion({ ...item, flagged });
  return { ok: true, flagged };
}

/* ---------------------------------------------------------------------------
 * Inleveren en afbreken
 * ------------------------------------------------------------------------- */

/**
 * Levert een poging in en berekent de score.
 *
 * @param auto true wanneer de tijd verstreek in plaats van dat je zelf
 *             inleverde; dat wordt apart vastgelegd omdat het iets zegt over je
 *             tempo.
 */
export async function submitAttempt(
  attemptId: string,
  auto = false,
): Promise<{ ok: boolean; score?: number; passed?: boolean }> {
  const attempt = await getAttempt(attemptId);
  if (!attempt) return { ok: false };
  if (attempt.finishedAt !== null) {
    return { ok: true, score: attempt.score ?? 0, passed: attempt.passed ?? false };
  }

  const items = await itemsOfAttempt(attemptId);
  const score = items.filter((item) => item.isCorrect === true).length;
  const passed = score >= attempt.passMark;

  await finishAttempt(
    {
      ...attempt,
      finishedAt: nowSeconds(),
      score,
      passed,
      autoSubmitted: auto,
    },
    items,
  );

  // Na een proefexamen alle antwoorden alsnog in het herhaalschema opnemen.
  // Tijdens het examen gebeurde dat bewust niet, om geen signaal te geven.
  if (attempt.mode === 'exam') {
    for (const item of items) {
      if (item.isCorrect === null) continue;
      await recordAnswerAsReview(
        item.questionId,
        attempt.certificationId,
        item.isCorrect,
        item.timeSpentMs,
      );
    }
  }

  return { ok: true, score, passed };
}

/** Breekt een lopende poging af zonder score, bijvoorbeeld bij een verkeerde start. */
export async function abandonAttempt(attemptId: string): Promise<void> {
  const attempt = await getAttempt(attemptId);
  if (!attempt || attempt.finishedAt !== null) return;
  await deleteAttempt(attemptId);
}

/**
 * Rondt pogingen af die nooit zijn ingeleverd.
 *
 * Draait bij het opstarten. Zonder dit blijft een examen dat je hebt weggeklikt
 * eeuwig "bezig", en blokkeert het het starten van een nieuwe poging.
 */
export async function cleanupStaleAttempts(): Promise<void> {
  const attempts = await allAttempts();

  for (const attempt of attempts) {
    if (attempt.finishedAt !== null) continue;
    if (attempt.timeLimitSeconds === null) continue;
    if (nowSeconds() - attempt.startedAt <= attempt.timeLimitSeconds + 300) continue;

    const items = await itemsOfAttempt(attempt.id);
    const score = items.filter((item) => item.isCorrect === true).length;

    await finishAttempt(
      {
        ...attempt,
        finishedAt: attempt.startedAt + attempt.timeLimitSeconds,
        score,
        passed: score >= attempt.passMark,
        autoSubmitted: true,
      },
      items,
    );
  }
}

/** Lopende pogingen, voor het hervat-blok op het dashboard. */
export async function getOpenAttempts(): Promise<AttemptRow[]> {
  const attempts = await allAttempts();
  return attempts.filter((attempt) => attempt.finishedAt === null);
}
