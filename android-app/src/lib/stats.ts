import {
  certifications,
  getCertification,
  objectivesFor,
  domainsFor,
  questionsFor,
  getDomainByCode,
  pick,
  type Locale,
} from './content';
import {
  allAttempts,
  allAttemptQuestions,
  type AttemptQuestionRow,
  type AttemptRow,
} from './store';

/**
 * Voortgangsanalyse.
 *
 * De centrale vraag is niet "hoeveel procent had ik goed", maar "waar zak ik
 * onder de cesuur". Daarom draait alles hier om scores per leerdoel en per
 * examengebied, afgezet tegen de 65%-grens van beide examens.
 *
 * De webversie laat SQL dit rekenwerk doen met group-by's over joins. Hier
 * gebeurt het in het geheugen: enkele duizenden antwoorden groeperen kost geen
 * meetbare tijd, en het scheelt een databaselaag die daarvoor zou moeten
 * bestaan.
 */

/** Onder dit percentage geldt een leerdoel als zwakke plek. */
export const PASS_RATIO = 0.65;
/** Minder dan dit aantal antwoorden geeft nog geen betrouwbaar beeld. */
const MIN_SAMPLES_FOR_CONFIDENCE = 3;

export interface AttemptSummary {
  id: string;
  mode: string;
  certificationId: string;
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

function summarize(attempt: AttemptRow): AttemptSummary {
  return {
    id: attempt.id,
    mode: attempt.mode,
    certificationId: attempt.certificationId,
    startedAt: attempt.startedAt,
    finishedAt: attempt.finishedAt,
    score: attempt.score,
    questionCount: attempt.questionCount,
    passMark: attempt.passMark,
    passed: attempt.passed,
    durationSeconds:
      attempt.finishedAt !== null ? attempt.finishedAt - attempt.startedAt : null,
    autoSubmitted: attempt.autoSubmitted,
  };
}

export async function getRecentAttempts(
  certificationId?: string,
  limit = 10,
): Promise<AttemptSummary[]> {
  const attempts = await allAttempts();
  return attempts
    .filter(
      (attempt) =>
        attempt.finishedAt !== null &&
        (!certificationId || attempt.certificationId === certificationId),
    )
    .slice(0, limit)
    .map(summarize);
}

/**
 * Berekent de voortgang voor één certificering.
 *
 * Alle beantwoorde vragen tellen mee, ongeacht de modus. Oefenen telt dus ook
 * — anders zou een gerichte oefensessie op je zwakste onderwerp onzichtbaar
 * blijven in de analyse, wat precies het verkeerde signaal geeft.
 */
export async function getCertificationProgress(
  certificationId: string,
  locale: Locale,
): Promise<CertificationProgress | null> {
  const certification = getCertification(certificationId);
  if (!certification) return null;

  const [attempts, items] = await Promise.all([
    allAttempts(),
    allAttemptQuestions(),
  ]);

  return computeProgress({
    certificationId,
    locale,
    attempts,
    items,
  });
}

/**
 * Voortgang voor alle certificeringen tegelijk.
 *
 * Het dashboard heeft ze allemaal nodig; per certificering apart uitrekenen zou
 * de hele antwoordtabel twee keer inlezen.
 */
export async function getAllProgress(
  locale: Locale,
): Promise<CertificationProgress[]> {
  const [attempts, items] = await Promise.all([
    allAttempts(),
    allAttemptQuestions(),
  ]);

  return certifications
    .map((certification) =>
      computeProgress({
        certificationId: certification.id,
        locale,
        attempts,
        items,
      }),
    )
    .filter((progress): progress is CertificationProgress => progress !== null);
}

function computeProgress(input: {
  certificationId: string;
  locale: Locale;
  attempts: AttemptRow[];
  items: AttemptQuestionRow[];
}): CertificationProgress | null {
  const { certificationId, locale } = input;
  const certification = getCertification(certificationId);
  if (!certification) return null;

  const attemptsForCert = input.attempts.filter(
    (attempt) => attempt.certificationId === certificationId,
  );
  const attemptIds = new Set(attemptsForCert.map((attempt) => attempt.id));
  const finished = attemptsForCert
    .filter((attempt) => attempt.finishedAt !== null)
    .map(summarize);

  const examOnly = finished.filter((a) => a.mode === 'exam' && a.score !== null);
  const scores = examOnly.map((a) => a.score ?? 0);
  const averageScore =
    scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;
  const bestScore = scores.length > 0 ? Math.max(...scores) : null;
  // `finished` staat op startedAt aflopend, dus de eerste is de meest recente.
  const lastScore = scores.length > 0 ? (scores[0] ?? null) : null;

  // Antwoorden groeperen per leerdoel. Alleen beantwoorde items tellen mee:
  // een overgeslagen vraag zegt niets over je beheersing van het leerdoel.
  const answersByObjective = new Map<string, { answered: number; correct: number }>();
  const seenQuestionIds = new Set<string>();

  for (const item of input.items) {
    if (!attemptIds.has(item.attemptId)) continue;
    if (item.selectedOptionId === null) continue;

    seenQuestionIds.add(item.questionId);

    const bucket = answersByObjective.get(item.objectiveId) ?? {
      answered: 0,
      correct: 0,
    };
    bucket.answered += 1;
    if (item.isCorrect === true) bucket.correct += 1;
    answersByObjective.set(item.objectiveId, bucket);
  }

  const objectiveScores: ObjectiveScore[] = objectivesFor(certificationId)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((objective) => {
      const bucket = answersByObjective.get(objective.id) ?? { answered: 0, correct: 0 };
      const domain = getDomainByCode(certificationId, objective.domainCode);
      return {
        objectiveId: objective.id,
        code: objective.code,
        topic: pick(locale, objective.topicNl, objective.topicEn),
        description: pick(locale, objective.descriptionNl, objective.descriptionEn),
        domainCode: objective.domainCode,
        domainTitle: domain ? pick(locale, domain.titleNl, domain.titleEn) : '',
        bloomLevel: objective.bloomLevel,
        answered: bucket.answered,
        correct: bucket.correct,
        ratio: bucket.answered > 0 ? bucket.correct / bucket.answered : 0,
        confident: bucket.answered >= MIN_SAMPLES_FOR_CONFIDENCE,
      };
    });

  const domainScores: DomainScore[] = domainsFor(certificationId).map((domain) => {
    const inDomain = objectiveScores.filter((o) => o.domainCode === domain.code);
    const answered = inDomain.reduce((sum, o) => sum + o.answered, 0);
    const correct = inDomain.reduce((sum, o) => sum + o.correct, 0);
    return {
      code: domain.code,
      title: pick(locale, domain.titleNl, domain.titleEn),
      weight: domain.weight,
      answered,
      correct,
      ratio: answered > 0 ? correct / answered : 0,
    };
  });

  const totalQuestions = questionsFor(certificationId).length;
  const seenQuestions = seenQuestionIds.size;

  const scored = objectiveScores.filter((o) => o.answered > 0);
  const weakest = scored
    .filter((o) => o.ratio < PASS_RATIO)
    .sort((a, b) => a.ratio - b.ratio || b.answered - a.answered)
    .slice(0, 8);
  const strongest = scored
    .filter((o) => o.confident)
    .sort((a, b) => b.ratio - a.ratio || b.answered - a.answered)
    .slice(0, 5);

  return {
    certificationId,
    title: pick(locale, certification.titleNl, certification.titleEn),
    accentColor: certification.accentColor,
    passMark: certification.passMark,
    questionCount: certification.questionCount,
    attempts: finished.slice(0, 10),
    examAttempts: examOnly.length,
    averageScore,
    bestScore,
    lastScore,
    readiness: computeReadiness({
      averageScore,
      lastScore,
      passMark: certification.passMark,
      questionCount: certification.questionCount,
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
  certificationId: string,
  limit = 10,
): Promise<string[]> {
  const progress = await getCertificationProgress(certificationId, 'nl');
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
