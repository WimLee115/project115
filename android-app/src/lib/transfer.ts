import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

import { newId } from './id';
import {
  allAttempts,
  allAttemptQuestions,
  allCards,
  allReviews,
  allPlans,
  replaceAll,
  getSettings,
  type AttemptRow,
  type AttemptQuestionRow,
  type FsrsCardRow,
  type FsrsReviewRow,
  type StudyPlanRow,
  type AttemptMode,
} from './store';
import type { Locale } from './content';

/**
 * Uitwisseling met de webversie.
 *
 * Beide versies schrijven hetzelfde JSON-formaat, dat van de export-route in de
 * webversie (`src/app/api/export/route.ts`). Daardoor kun je op je pc een
 * export maken en die hier inlezen, en andersom.
 *
 * Twee dingen worden bij het inlezen rechtgezet, omdat de opslagvormen
 * verschillen:
 * - `optionOrder` is in SQLite een JSON-string en hier een array;
 * - `userId` bestaat hier niet, want deze app heeft één gebruiker per toestel.
 *
 * Wat er níét in gaat: wachtwoordhashes, sessietokens en TOTP-secrets. Dat zijn
 * inloggegevens, geen studiegegevens, en ze horen niet in een bestand dat in je
 * downloadmap of een chat belandt.
 */

const FORMAT = 'Project115';

export interface ExportPayload {
  exportedAt: string;
  application: string;
  author: string;
  source: 'android' | 'web';
  user: {
    id: string;
    displayName: string;
    locale: Locale;
  };
  studyPlans: unknown[];
  attempts: unknown[];
  answers: Array<{ attemptId: string; items: unknown[] }>;
  spacedRepetition: { cards: unknown[]; reviews: unknown[] };
}

/* ---------------------------------------------------------------------------
 * Exporteren
 * ------------------------------------------------------------------------- */

export async function buildExport(): Promise<ExportPayload> {
  const [attempts, items, cards, reviews, plans, settings] = await Promise.all([
    allAttempts(),
    allAttemptQuestions(),
    allCards(),
    allReviews(),
    allPlans(),
    getSettings(),
  ]);

  // Een vast gebruikers-id zodat de webversie de rijen aan één gebruiker kan
  // koppelen bij een eventuele import daar.
  const userId = 'android-local';

  const itemsByAttempt = new Map<string, AttemptQuestionRow[]>();
  for (const item of items) {
    const list = itemsByAttempt.get(item.attemptId);
    if (list) list.push(item);
    else itemsByAttempt.set(item.attemptId, [item]);
  }

  return {
    exportedAt: new Date().toISOString(),
    application: FORMAT,
    author: 'B. van Rooij',
    source: 'android',
    user: {
      id: userId,
      displayName: settings.displayName,
      locale: settings.locale,
    },
    studyPlans: plans.map((plan) => ({ ...plan, userId })),
    attempts: attempts.map((attempt) => ({ ...attempt, userId })),
    answers: attempts.map((attempt) => ({
      attemptId: attempt.id,
      items: (itemsByAttempt.get(attempt.id) ?? []).map((item) => ({
        ...item,
        // Zelfde vorm als de SQLite-kolom in de webversie.
        optionOrder: JSON.stringify(item.optionOrder),
      })),
    })),
    spacedRepetition: {
      cards: cards.map((card) => ({ ...card, userId })),
      reviews: reviews.map((review) => ({ ...review, userId })),
    },
  };
}

export interface ExportResult {
  /** Pad of bestandsnaam zoals dat aan de gebruiker getoond kan worden. */
  location: string;
  shared: boolean;
}

/**
 * Schrijft de export weg en biedt hem aan om te delen.
 *
 * Op Android landt het bestand in de map Documenten, zodat het ook terug te
 * vinden is als je het deelvenster wegklikt. In een gewone browser (tijdens
 * ontwikkelen) valt de functie terug op een download.
 */
export async function exportToFile(): Promise<ExportResult> {
  const payload = await buildExport();
  const json = JSON.stringify(payload, null, 2);
  const stamp = new Date().toISOString().slice(0, 10);
  const fileName = `project115-export-${stamp}.json`;

  if (!Capacitor.isNativePlatform()) {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
    return { location: fileName, shared: false };
  }

  await Filesystem.writeFile({
    path: fileName,
    data: json,
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
    recursive: true,
  });

  const { uri } = await Filesystem.getUri({
    path: fileName,
    directory: Directory.Documents,
  });

  let shared = false;
  try {
    await Share.share({
      title: 'Project115 — studiegegevens',
      files: [uri],
    });
    shared = true;
  } catch {
    // Het deelvenster wegklikken is geen fout; het bestand staat er al.
  }

  return { location: `Documenten/${fileName}`, shared };
}

/* ---------------------------------------------------------------------------
 * Importeren
 * ------------------------------------------------------------------------- */

export interface ImportSummary {
  attempts: number;
  answers: number;
  cards: number;
  reviews: number;
  plans: number;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asNullableNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  // SQLite slaat booleans op als 0/1; een oudere export kan die vorm hebben.
  if (typeof value === 'number') return value !== 0;
  return fallback;
}

/** Voor velden waar null een eigen betekenis heeft: nog niet beantwoord. */
function asNullableBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  return null;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asLocale(value: unknown): Locale {
  return value === 'en' ? 'en' : 'nl';
}

function asMode(value: unknown): AttemptMode {
  return value === 'exam' || value === 'practice' || value === 'weakspot' || value === 'review'
    ? value
    : 'practice';
}

function asOptionOrder(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  if (typeof value === 'string') {
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((v): v is string => typeof v === 'string')
        : [];
    } catch {
      return [];
    }
  }
  return [];
}

function asRating(value: unknown): 1 | 2 | 3 | 4 {
  return value === 1 || value === 2 || value === 3 || value === 4 ? value : 3;
}

/**
 * Leest een export en vervangt de gegevens op dit toestel.
 *
 * Bewust vervangen en niet samenvoegen. Samenvoegen van twee herhaalschema's
 * vereist een keuze per kaart — welke van de twee 'due'-momenten geldt? — en
 * elke automatische keuze daarin is een gok met je planning. Vervangen is
 * voorspelbaar: wat je importeert, is wat je krijgt.
 */
export async function importFromJson(text: string): Promise<ImportSummary> {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('Dit is geen geldig JSON-bestand.');
  }

  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Het bestand heeft niet de verwachte structuur.');
  }

  const payload = raw as Partial<ExportPayload>;
  if (payload.application !== FORMAT) {
    throw new Error('Dit bestand komt niet uit Project115.');
  }

  const attemptRows: AttemptRow[] = (payload.attempts ?? [])
    .filter((row): row is Record<string, unknown> => typeof row === 'object' && row !== null)
    .map((row) => ({
      id: asString(row.id, newId('att')),
      certificationId: asString(row.certificationId),
      mode: asMode(row.mode),
      locale: asLocale(row.locale),
      startedAt: asNumber(row.startedAt, 0),
      finishedAt: asNullableNumber(row.finishedAt),
      timeLimitSeconds: asNullableNumber(row.timeLimitSeconds),
      extraTimeApplied: asBoolean(row.extraTimeApplied),
      questionCount: asNumber(row.questionCount, 0),
      score: asNullableNumber(row.score),
      passMark: asNumber(row.passMark, 0),
      passed: asNullableBoolean(row.passed),
      autoSubmitted: asBoolean(row.autoSubmitted),
    }))
    .filter((attempt) => attempt.certificationId !== '');

  const knownAttemptIds = new Set(attemptRows.map((attempt) => attempt.id));

  const answerRows: AttemptQuestionRow[] = (payload.answers ?? []).flatMap((group) => {
    if (typeof group !== 'object' || group === null) return [];
    const items = (group as { items?: unknown }).items;
    if (!Array.isArray(items)) return [];

    return items
      .filter((row): row is Record<string, unknown> => typeof row === 'object' && row !== null)
      .map((row) => ({
        id: asString(row.id, newId('aq')),
        attemptId: asString(row.attemptId),
        questionId: asString(row.questionId),
        objectiveId: asString(row.objectiveId),
        position: asNumber(row.position, 0),
        optionOrder: asOptionOrder(row.optionOrder),
        selectedOptionId:
          typeof row.selectedOptionId === 'string' ? row.selectedOptionId : null,
        isCorrect: asNullableBoolean(row.isCorrect),
        flagged: asBoolean(row.flagged),
        timeSpentMs: asNumber(row.timeSpentMs, 0),
        answeredAt: asNullableNumber(row.answeredAt),
      }))
      // Antwoorden zonder bijbehorende poging zouden de statistiek scheeftrekken.
      .filter((item) => knownAttemptIds.has(item.attemptId));
  });

  const cardRows: FsrsCardRow[] = (payload.spacedRepetition?.cards ?? [])
    .filter((row): row is Record<string, unknown> => typeof row === 'object' && row !== null)
    .map((row) => ({
      id: asString(row.id, newId('card')),
      itemType: row.itemType === 'term' ? ('term' as const) : ('question' as const),
      itemId: asString(row.itemId),
      certificationId: asString(row.certificationId),
      due: asNumber(row.due, 0),
      stability: asNumber(row.stability, 0),
      difficulty: asNumber(row.difficulty, 0),
      elapsedDays: asNumber(row.elapsedDays, 0),
      scheduledDays: asNumber(row.scheduledDays, 0),
      reps: asNumber(row.reps, 0),
      lapses: asNumber(row.lapses, 0),
      state: asNumber(row.state, 0),
      lastReview: asNullableNumber(row.lastReview),
      suspended: asBoolean(row.suspended),
    }))
    .filter((card) => card.itemId !== '');

  // Eén kaart per item; een dubbele zou de unieke index breken.
  const seenItems = new Set<string>();
  const uniqueCards = cardRows.filter((card) => {
    const key = `${card.itemType} ${card.itemId}`;
    if (seenItems.has(key)) return false;
    seenItems.add(key);
    return true;
  });

  const knownCardIds = new Set(uniqueCards.map((card) => card.id));

  const reviewRows: FsrsReviewRow[] = (payload.spacedRepetition?.reviews ?? [])
    .filter((row): row is Record<string, unknown> => typeof row === 'object' && row !== null)
    .map((row) => ({
      cardId: asString(row.cardId),
      rating: asRating(row.rating),
      state: asNumber(row.state, 0),
      scheduledDays: asNumber(row.scheduledDays, 0),
      elapsedDays: asNumber(row.elapsedDays, 0),
      reviewedAt: asNumber(row.reviewedAt, 0),
      durationMs: asNumber(row.durationMs, 0),
    }))
    .filter((review) => knownCardIds.has(review.cardId));

  const planRows: StudyPlanRow[] = (payload.studyPlans ?? [])
    .filter((row): row is Record<string, unknown> => typeof row === 'object' && row !== null)
    .map((row) => ({
      id: asString(row.id, newId('plan')),
      certificationId: asString(row.certificationId),
      examDate: asNullableNumber(row.examDate),
      dailyReviewTarget: asNumber(row.dailyReviewTarget, 30),
      useExtraTime: asBoolean(row.useExtraTime),
      preferredLocale: asLocale(row.preferredLocale),
      createdAt: asNumber(row.createdAt, Math.floor(Date.now() / 1000)),
      updatedAt: asNumber(row.updatedAt, Math.floor(Date.now() / 1000)),
    }))
    .filter((plan) => plan.certificationId !== '');

  // Eén plan per certificering; de index in de opslag is uniek.
  const seenCerts = new Set<string>();
  const uniquePlans = planRows.filter((plan) => {
    if (seenCerts.has(plan.certificationId)) return false;
    seenCerts.add(plan.certificationId);
    return true;
  });

  await replaceAll({
    attempts: attemptRows,
    attemptQuestions: answerRows,
    cards: uniqueCards,
    reviews: reviewRows,
    plans: uniquePlans,
  });

  return {
    attempts: attemptRows.length,
    answers: answerRows.length,
    cards: uniqueCards.length,
    reviews: reviewRows.length,
    plans: uniquePlans.length,
  };
}
