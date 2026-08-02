import 'server-only';

import { eq, and, inArray, sql } from 'drizzle-orm';

import { db } from '@/db';
import {
  questions,
  objectives,
  domains,
  certifications,
  attemptQuestions,
  questionOptions,
} from '@/db/schema';
import { allocateByWeight, createRandom, shuffle } from './allocation';

export { allocateByWeight } from './allocation';

/**
 * Examengeneratie.
 *
 * Een proefexamen is pas nuttig als de verdeling over de examengebieden
 * overeenkomt met het echte examen. Een willekeurige greep uit de vragenbank
 * geeft een vertekend beeld: het ITIL-waardesysteem is goed voor 40% van het
 * examen en moet dus ook 40% van je oefenvragen leveren.
 *
 * De verdeling wordt bepaald met de grootste-restmethode (Hare-quota), zodat
 * afronding per domein niet leidt tot een examen van 39 of 41 vragen.
 */

export interface GeneratedQuestion {
  questionId: string;
  objectiveId: string;
  /** Volgorde waarin de opties getoond worden; husselt de positie van het juiste antwoord. */
  optionOrder: string[];
}

export interface GenerateOptions {
  certificationId: string;
  /** Aantal vragen; standaard het aantal uit het echte examen. */
  count?: number;
  /**
   * Vragen die bij voorkeur worden vermeden omdat ze recent zijn gezien.
   * Ze worden alleen gebruikt als er anders te weinig vragen overblijven.
   */
  excludeQuestionIds?: string[];
  /** Beperk tot specifieke leerdoelen (voor gerichte oefensessies). */
  objectiveIds?: string[];
  /** Deterministische selectie voor tests. */
  seed?: number;
}

interface QuestionRow {
  id: string;
  objectiveId: string;
  domainCode: string;
  difficulty: number;
}

/**
 * Stelt een examen samen met de officiële domeinverdeling.
 *
 * Wanneer een domein onvoldoende vragen heeft, wordt het tekort aangevuld uit
 * de overige domeinen. Dat is beter dan een korter examen: je oefent nog
 * steeds met het juiste aantal vragen onder dezelfde tijdsdruk.
 */
export async function generateExam(
  options: GenerateOptions,
): Promise<GeneratedQuestion[]> {
  const random = createRandom(options.seed);

  const cert = await db
    .select()
    .from(certifications)
    .where(eq(certifications.id, options.certificationId))
    .limit(1);

  const certification = cert[0];
  if (!certification) {
    throw new Error(`Onbekende certificering: ${options.certificationId}`);
  }

  const total = options.count ?? certification.questionCount;

  const filters = [
    eq(questions.certificationId, options.certificationId),
    eq(questions.active, true),
  ];
  if (options.objectiveIds?.length) {
    filters.push(inArray(questions.objectiveId, options.objectiveIds));
  }

  const rows: QuestionRow[] = await db
    .select({
      id: questions.id,
      objectiveId: questions.objectiveId,
      domainCode: domains.code,
      difficulty: questions.difficulty,
    })
    .from(questions)
    .innerJoin(objectives, eq(questions.objectiveId, objectives.id))
    .innerJoin(domains, eq(objectives.domainId, domains.id))
    .where(and(...filters));

  if (rows.length === 0) return [];

  const excluded = new Set(options.excludeQuestionIds ?? []);

  const domainRows = await db
    .select({ code: domains.code, weight: domains.weight })
    .from(domains)
    .where(eq(domains.certificationId, options.certificationId));

  // Bij een gerichte oefensessie op één leerdoel is de domeinverdeling niet
  // zinvol; dan is een simpele greep uit de beschikbare vragen correct.
  const useWeights = !options.objectiveIds?.length && domainRows.length > 0;

  const byDomain = new Map<string, QuestionRow[]>();
  for (const row of rows) {
    const list = byDomain.get(row.domainCode) ?? [];
    list.push(row);
    byDomain.set(row.domainCode, list);
  }

  const picked: QuestionRow[] = [];
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
  const optionRows = await db
    .select({
      id: questionOptions.id,
      questionId: questionOptions.questionId,
      sortOrder: questionOptions.sortOrder,
    })
    .from(questionOptions)
    .where(inArray(questionOptions.questionId, finalQuestions.map((q) => q.id)));

  const typeRows = await db
    .select({ id: questions.id, type: questions.type })
    .from(questions)
    .where(inArray(questions.id, finalQuestions.map((q) => q.id)));

  const typeById = new Map(typeRows.map((r) => [r.id, r.type]));
  const optionsByQuestion = new Map<string, Array<{ id: string; sortOrder: number }>>();
  for (const option of optionRows) {
    const list = optionsByQuestion.get(option.questionId) ?? [];
    list.push({ id: option.id, sortOrder: option.sortOrder });
    optionsByQuestion.set(option.questionId, list);
  }

  return finalQuestions.map((question) => {
    const opts = (optionsByQuestion.get(question.id) ?? []).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
    const ids = opts.map((o) => o.id);
    const isList = typeById.get(question.id) === 'list';

    return {
      questionId: question.id,
      objectiveId: question.objectiveId,
      optionOrder: isList ? ids : shuffle(ids, random),
    };
  });
}

/** Vragen die de gebruiker recent heeft gezien, om herhaling te beperken. */
export async function getRecentlySeenQuestionIds(
  userId: string,
  certificationId: string,
  limit = 80,
): Promise<string[]> {
  const rows = await db
    .select({ questionId: attemptQuestions.questionId })
    .from(attemptQuestions)
    .innerJoin(
      sql`attempts`,
      sql`attempts.id = ${attemptQuestions.attemptId}`,
    )
    .where(
      sql`attempts.user_id = ${userId} AND attempts.certification_id = ${certificationId}`,
    )
    .orderBy(sql`attempts.started_at DESC`)
    .limit(limit);

  return [...new Set(rows.map((r) => r.questionId))];
}
