import 'server-only';

import { eq, and, desc, sql, isNotNull } from 'drizzle-orm';

import { db } from '@/db';
import {
  attempts,
  attemptQuestions,
  objectives,
  domains,
  certifications,
  questions,
} from '@/db/schema';
import type { Locale } from '@/lib/i18n';

/**
 * Voortgangsanalyse.
 *
 * De centrale vraag is niet "hoeveel procent had ik goed", maar "waar zak ik
 * onder de cesuur". Daarom draait alles hier om scores per leerdoel en per
 * examengebied, afgezet tegen de 65%-grens van beide examens.
 */

/** Onder dit percentage geldt een leerdoel als zwakke plek. */
export const PASS_RATIO = 0.65;
/** Minder dan dit aantal antwoorden geeft nog geen betrouwbaar beeld. */
const MIN_SAMPLES_FOR_CONFIDENCE = 3;

export interface AttemptSummary {
  id: string;
  mode: string;
  startedAt: number;
  finishedAt: number | null;
  score: number | null;
  questionCount: number;
  passMark: number;
  passed: boolean | null;
  durationSeconds: number | null;
  autoSubmitted: boolean;
}

export interface ObjectiveScore {
  objectiveId: string;
  code: string;
  topic: string;
  description: string;
  domainCode: string;
  domainTitle: string;
  bloomLevel: number;
  answered: number;
  correct: number;
  ratio: number;
  /** Genoeg antwoorden om er conclusies aan te verbinden? */
  confident: boolean;
}

export interface DomainScore {
  code: string;
  title: string;
  weight: number;
  answered: number;
  correct: number;
  ratio: number;
}

export interface CertificationProgress {
  certificationId: string;
  title: string;
  accentColor: string;
  passMark: number;
  questionCount: number;
  attempts: AttemptSummary[];
  examAttempts: number;
  averageScore: number | null;
  bestScore: number | null;
  lastScore: number | null;
  /** 0-100. Combineert dekking van de stof met de gemiddelde score. */
  readiness: number;
  domainScores: DomainScore[];
  objectiveScores: ObjectiveScore[];
  weakest: ObjectiveScore[];
  strongest: ObjectiveScore[];
  totalQuestions: number;
  seenQuestions: number;
}

export async function getRecentAttempts(
  userId: string,
  certificationId?: string,
  limit = 10,
): Promise<AttemptSummary[]> {
  const filters = [eq(attempts.userId, userId), isNotNull(attempts.finishedAt)];
  if (certificationId) filters.push(eq(attempts.certificationId, certificationId));

  const rows = await db
    .select()
    .from(attempts)
    .where(and(...filters))
    .orderBy(desc(attempts.startedAt))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    mode: row.mode,
    startedAt: row.startedAt,
    finishedAt: row.finishedAt,
    score: row.score,
    questionCount: row.questionCount,
    passMark: row.passMark,
    passed: row.passed,
    durationSeconds:
      row.finishedAt !== null ? row.finishedAt - row.startedAt : null,
    autoSubmitted: row.autoSubmitted,
  }));
}

/**
 * Berekent de voortgang voor één certificering.
 *
 * Alle beantwoorde vragen tellen mee, ongeacht de modus. Oefenen telt dus ook
 * — anders zou een gerichte oefensessie op je zwakste onderwerp onzichtbaar
 * blijven in de analyse, wat precies het verkeerde signaal geeft.
 */
export async function getCertificationProgress(
  userId: string,
  certificationId: string,
  locale: Locale,
): Promise<CertificationProgress | null> {
  const certRows = await db
    .select()
    .from(certifications)
    .where(eq(certifications.id, certificationId))
    .limit(1);

  const cert = certRows[0];
  if (!cert) return null;

  const attemptList = await getRecentAttempts(userId, certificationId, 50);
  const examOnly = attemptList.filter(
    (a) => a.mode === 'exam' && a.score !== null,
  );

  const scores = examOnly.map((a) => a.score ?? 0);
  const averageScore =
    scores.length > 0
      ? scores.reduce((sum, s) => sum + s, 0) / scores.length
      : null;
  const bestScore = scores.length > 0 ? Math.max(...scores) : null;
  const lastScore = scores.length > 0 ? (scores[0] ?? null) : null;

  // Per leerdoel optellen hoeveel er is beantwoord en hoeveel goed.
  const perObjective = await db
    .select({
      objectiveId: objectives.id,
      code: objectives.code,
      topicNl: objectives.topicNl,
      topicEn: objectives.topicEn,
      descriptionNl: objectives.descriptionNl,
      descriptionEn: objectives.descriptionEn,
      bloomLevel: objectives.bloomLevel,
      domainCode: domains.code,
      domainTitleNl: domains.titleNl,
      domainTitleEn: domains.titleEn,
      domainWeight: domains.weight,
      answered: sql<number>`count(${attemptQuestions.id})`,
      correct: sql<number>`sum(case when ${attemptQuestions.isCorrect} = 1 then 1 else 0 end)`,
    })
    .from(objectives)
    .innerJoin(domains, eq(objectives.domainId, domains.id))
    .leftJoin(
      attemptQuestions,
      eq(attemptQuestions.objectiveId, objectives.id),
    )
    .leftJoin(
      attempts,
      and(
        eq(attempts.id, attemptQuestions.attemptId),
        eq(attempts.userId, userId),
      ),
    )
    .where(eq(objectives.certificationId, certificationId))
    .groupBy(objectives.id);

  const objectiveScores: ObjectiveScore[] = perObjective.map((row) => {
    // De left joins tellen ook rijen van andere gebruikers weg; answered is 0
    // wanneer er geen eigen antwoorden zijn.
    const answered = Number(row.answered ?? 0);
    const correct = Number(row.correct ?? 0);
    return {
      objectiveId: row.objectiveId,
      code: row.code,
      topic: locale === 'nl' ? row.topicNl : row.topicEn,
      description: locale === 'nl' ? row.descriptionNl : row.descriptionEn,
      domainCode: row.domainCode,
      domainTitle: locale === 'nl' ? row.domainTitleNl : row.domainTitleEn,
      bloomLevel: row.bloomLevel,
      answered,
      correct,
      ratio: answered > 0 ? correct / answered : 0,
      confident: answered >= MIN_SAMPLES_FOR_CONFIDENCE,
    };
  });

  const domainRows = await db
    .select({
      code: domains.code,
      titleNl: domains.titleNl,
      titleEn: domains.titleEn,
      weight: domains.weight,
      sortOrder: domains.sortOrder,
    })
    .from(domains)
    .where(eq(domains.certificationId, certificationId))
    .orderBy(domains.sortOrder);

  const domainScores: DomainScore[] = domainRows.map((domain) => {
    const inDomain = objectiveScores.filter((o) => o.domainCode === domain.code);
    const answered = inDomain.reduce((sum, o) => sum + o.answered, 0);
    const correct = inDomain.reduce((sum, o) => sum + o.correct, 0);
    return {
      code: domain.code,
      title: locale === 'nl' ? domain.titleNl : domain.titleEn,
      weight: domain.weight,
      answered,
      correct,
      ratio: answered > 0 ? correct / answered : 0,
    };
  });

  const questionCountRows = await db
    .select({ total: sql<number>`count(*)` })
    .from(questions)
    .where(
      and(
        eq(questions.certificationId, certificationId),
        eq(questions.active, true),
      ),
    );
  const totalQuestions = Number(questionCountRows[0]?.total ?? 0);

  const seenRows = await db
    .select({ seen: sql<number>`count(distinct ${attemptQuestions.questionId})` })
    .from(attemptQuestions)
    .innerJoin(attempts, eq(attempts.id, attemptQuestions.attemptId))
    .where(
      and(
        eq(attempts.userId, userId),
        eq(attempts.certificationId, certificationId),
        isNotNull(attemptQuestions.selectedOptionId),
      ),
    );
  const seenQuestions = Number(seenRows[0]?.seen ?? 0);

  const scored = objectiveScores.filter((o) => o.answered > 0);
  const weakest = [...scored]
    .filter((o) => o.ratio < PASS_RATIO)
    .sort((a, b) => a.ratio - b.ratio || b.answered - a.answered)
    .slice(0, 8);
  const strongest = [...scored]
    .filter((o) => o.confident)
    .sort((a, b) => b.ratio - a.ratio || b.answered - a.answered)
    .slice(0, 5);

  return {
    certificationId,
    title: locale === 'nl' ? cert.titleNl : cert.titleEn,
    accentColor: cert.accentColor,
    passMark: cert.passMark,
    questionCount: cert.questionCount,
    attempts: attemptList.slice(0, 10),
    examAttempts: examOnly.length,
    averageScore,
    bestScore,
    lastScore,
    readiness: computeReadiness({
      averageScore,
      lastScore,
      passMark: cert.passMark,
      questionCount: cert.questionCount,
      seenQuestions,
      totalQuestions,
      examAttempts: examOnly.length,
    }),
    domainScores,
    objectiveScores,
    weakest,
    strongest,
    totalQuestions,
    seenQuestions,
  };
}

/**
 * Examengereedheid als één getal van 0 tot 100.
 *
 * Opgebouwd uit drie factoren, omdat geen ervan alleen genoeg zegt:
 * - prestatie (60%): hoe scoor je ten opzichte van de cesuur, met het
 *   zwaartepunt op je laatste examen — vooruitgang telt zwaarder dan historie;
 * - dekking (30%): hoeveel van de vragenbank heb je überhaupt gezien;
 * - ervaring (10%): één keer boven de cesuur scoren is geen bewijs, drie keer
 *   wel. Dit dempt een toevalstreffer.
 */
function computeReadiness(input: {
  averageScore: number | null;
  lastScore: number | null;
  passMark: number;
  questionCount: number;
  seenQuestions: number;
  totalQuestions: number;
  examAttempts: number;
}): number {
  const { averageScore, lastScore, passMark, questionCount } = input;

  if (averageScore === null || lastScore === null) {
    // Zonder examenpogingen telt alleen dekking mee, en dan gedempt: de stof
    // gezien hebben is niet hetzelfde als hem beheersen.
    const coverage =
      input.totalQuestions > 0 ? input.seenQuestions / input.totalQuestions : 0;
    return Math.round(coverage * 25);
  }

  // Score genormaliseerd op de cesuur: precies op de cesuur = 0,75.
  const normalize = (score: number) => {
    const ratio = score / questionCount;
    const passRatio = passMark / questionCount;
    if (ratio >= passRatio) {
      // Boven de cesuur: 0,75 tot 1,0.
      return 0.75 + 0.25 * ((ratio - passRatio) / Math.max(1 - passRatio, 0.01));
    }
    // Onder de cesuur: 0 tot 0,75.
    return 0.75 * (ratio / Math.max(passRatio, 0.01));
  };

  const performance = 0.6 * normalize(lastScore) + 0.4 * normalize(averageScore);
  const coverage =
    input.totalQuestions > 0
      ? Math.min(1, input.seenQuestions / input.totalQuestions)
      : 0;
  const experience = Math.min(1, input.examAttempts / 3);

  const score = 0.6 * performance + 0.3 * coverage + 0.1 * experience;
  return Math.max(0, Math.min(100, Math.round(score * 100)));
}

/** Leerdoelen waar gericht op geoefend moet worden. */
export async function getWeakObjectiveIds(
  userId: string,
  certificationId: string,
  limit = 10,
): Promise<string[]> {
  const progress = await getCertificationProgress(userId, certificationId, 'nl');
  if (!progress) return [];

  const weak = progress.weakest.map((o) => o.objectiveId).slice(0, limit);

  // Nog nooit geoefende leerdoelen zijn per definitie een zwakke plek.
  if (weak.length < limit) {
    const untouched = progress.objectiveScores
      .filter((o) => o.answered === 0)
      .map((o) => o.objectiveId)
      .slice(0, limit - weak.length);
    weak.push(...untouched);
  }

  return weak;
}
