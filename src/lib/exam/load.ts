import 'server-only';

import { eq, and, asc, inArray } from 'drizzle-orm';

import { db } from '@/db';
import {
  attempts,
  attemptQuestions,
  questions,
  questionOptions,
  objectives,
  domains,
  certifications,
} from '@/db/schema';
import type { Locale } from '@/lib/i18n';

/**
 * Laden van een poging met alle vragen, in de taal van de poging.
 *
 * Beide taalvarianten worden meegestuurd zodat je tijdens het studeren per
 * vraag kunt omschakelen zonder een serverronde. Het juiste antwoord gaat
 * alleen mee wanneer `includeAnswers` waar is — in examenmodus dus niet, ook
 * niet verborgen in de payload.
 */

export interface LoadedOption {
  id: string;
  label: string;
  text: string;
  textAlt: string;
  /** Alleen gevuld wanneer antwoorden zijn vrijgegeven. */
  isCorrect?: boolean;
  rationale?: string | null;
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
  /** Alleen gevuld wanneer antwoorden zijn vrijgegeven. */
  explanation?: string;
  sourceRef?: string | null;
}

export interface LoadedAttempt {
  id: string;
  userId: string;
  certificationId: string;
  certificationTitle: string;
  accentColor: string;
  mode: string;
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

export async function loadAttempt(
  attemptId: string,
  userId: string,
  options: { includeAnswers?: boolean } = {},
): Promise<LoadedAttempt | null> {
  const attemptRows = await db
    .select({ attempt: attempts, cert: certifications })
    .from(attempts)
    .innerJoin(certifications, eq(attempts.certificationId, certifications.id))
    .where(and(eq(attempts.id, attemptId), eq(attempts.userId, userId)))
    .limit(1);

  const row = attemptRows[0];
  if (!row) return null;

  const attempt = row.attempt;
  const locale = attempt.locale;

  // Antwoorden zijn beschikbaar zodra de poging is afgerond, of direct in
  // oefenmodus. Tijdens een lopend proefexamen nooit.
  const answersAvailable =
    options.includeAnswers ??
    (attempt.finishedAt !== null || attempt.mode !== 'exam');

  const items = await db
    .select({
      item: attemptQuestions,
      question: questions,
      objective: objectives,
      domain: domains,
    })
    .from(attemptQuestions)
    .innerJoin(questions, eq(attemptQuestions.questionId, questions.id))
    .innerJoin(objectives, eq(questions.objectiveId, objectives.id))
    .innerJoin(domains, eq(objectives.domainId, domains.id))
    .where(eq(attemptQuestions.attemptId, attemptId))
    .orderBy(asc(attemptQuestions.position));

  // Alle opties in één query ophalen in plaats van per vraag: bij 40 vragen
  // scheelt dat 40 databaseronden per paginaweergave.
  const questionIds = items.map(({ question }) => question.id);
  const allOptions =
    questionIds.length > 0
      ? await db
          .select()
          .from(questionOptions)
          .where(inArray(questionOptions.questionId, questionIds))
      : [];

  const optionsByQuestion = new Map<string, typeof allOptions>();
  for (const option of allOptions) {
    const list = optionsByQuestion.get(option.questionId) ?? [];
    list.push(option);
    optionsByQuestion.set(option.questionId, list);
  }

  const loadedQuestions: LoadedQuestion[] = items.map(
    ({ item, question, objective, domain }) => {
      const order: string[] = JSON.parse(item.optionOrder);
      const available = optionsByQuestion.get(question.id) ?? [];
      const byId = new Map(available.map((o) => [o.id, o]));

      // Volg de opgeslagen volgorde; opties die er niet meer zijn (na een
      // contentwijziging) worden overgeslagen in plaats van de vraag te breken.
      const ordered = order
        .map((id) => byId.get(id))
        .filter((o): o is (typeof available)[number] => o !== undefined);

      const labels = ['A', 'B', 'C', 'D'];

      const listItemsRaw: Array<{ nl: string; en: string }> | null = question.listItems
        ? JSON.parse(question.listItems)
        : null;

      return {
        position: item.position,
        questionId: question.id,
        type: question.type,
        bloomLevel: question.bloomLevel,
        stem: locale === 'nl' ? question.stemNl : question.stemEn,
        stemAlt: locale === 'nl' ? question.stemEn : question.stemNl,
        listItems:
          listItemsRaw?.map((li) => ({
            text: locale === 'nl' ? li.nl : li.en,
            textAlt: locale === 'nl' ? li.en : li.nl,
          })) ?? null,
        options: ordered.map((option, index) => ({
          id: option.id,
          label: labels[index] ?? String.fromCharCode(65 + index),
          text: locale === 'nl' ? option.textNl : option.textEn,
          textAlt: locale === 'nl' ? option.textEn : option.textNl,
          ...(answersAvailable
            ? {
                isCorrect: option.isCorrect,
                rationale: locale === 'nl' ? option.rationaleNl : option.rationaleEn,
              }
            : {}),
        })),
        selectedOptionId: item.selectedOptionId,
        flagged: item.flagged,
        isCorrect: answersAvailable ? item.isCorrect : null,
        objectiveCode: objective.code,
        objectiveDescription:
          locale === 'nl' ? objective.descriptionNl : objective.descriptionEn,
        domainCode: domain.code,
        domainTitle: locale === 'nl' ? domain.titleNl : domain.titleEn,
        ...(answersAvailable
          ? {
              explanation:
                locale === 'nl' ? question.explanationNl : question.explanationEn,
              sourceRef: question.sourceRef,
            }
          : {}),
      };
    },
  );

  return {
    id: attempt.id,
    userId: attempt.userId,
    certificationId: attempt.certificationId,
    certificationTitle: locale === 'nl' ? row.cert.titleNl : row.cert.titleEn,
    accentColor: row.cert.accentColor,
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
    questions: loadedQuestions,
  };
}
