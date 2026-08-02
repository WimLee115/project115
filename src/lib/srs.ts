import 'server-only';

import {
  fsrs,
  generatorParameters,
  Rating,
  State,
  createEmptyCard,
  type Card,
  type Grade,
} from 'ts-fsrs';
import { eq, and, lte, sql, inArray } from 'drizzle-orm';

import { db } from '@/db';
import { fsrsCards, fsrsReviews } from '@/db/schema';
import { newId } from '@/lib/crypto';

/**
 * Spaced repetition met FSRS.
 *
 * FSRS (Free Spaced Repetition Scheduler) modelleert per kaart een
 * geheugentoestand — stabiliteit en moeilijkheid — en plant de volgende
 * herhaling op het moment dat je het bijna vergeten bent. Dat levert bij
 * gelijk aantal herhalingen meetbaar betere retentie dan het oudere SM-2.
 *
 * `requestRetention` staat op 0,9: je mikt op 90% kans dat je het antwoord nog
 * weet op het moment van herhalen. Voor examenvoorbereiding is dat een goede
 * balans tussen zekerheid en het aantal herhalingen per dag.
 */

const params = generatorParameters({
  request_retention: 0.9,
  // Voorkomt intervallen die voorbij een realistische examendatum schieten.
  maximum_interval: 365,
  enable_fuzz: true,
});

const scheduler = fsrs(params);

export { Rating, State };

export type ReviewRating = 1 | 2 | 3 | 4;

export interface DueCard {
  cardId: string;
  itemType: 'question' | 'term';
  itemId: string;
  certificationId: string;
  due: number;
  state: number;
  reps: number;
  lapses: number;
}

function toFsrsCard(row: {
  due: number;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: number;
  lastReview: number | null;
}): Card {
  return {
    due: new Date(row.due * 1000),
    stability: row.stability,
    difficulty: row.difficulty,
    elapsed_days: row.elapsedDays,
    scheduled_days: row.scheduledDays,
    reps: row.reps,
    lapses: row.lapses,
    state: row.state as State,
    last_review: row.lastReview ? new Date(row.lastReview * 1000) : undefined,
    learning_steps: 0,
  } as Card;
}

/**
 * Zorgt dat er een kaart bestaat voor dit item. Nieuwe kaarten zijn direct
 * 'due', zodat ze in de eerstvolgende sessie aan bod komen.
 */
export async function ensureCard(
  userId: string,
  itemType: 'question' | 'term',
  itemId: string,
  certificationId: string,
): Promise<string> {
  const existing = await db
    .select({ id: fsrsCards.id })
    .from(fsrsCards)
    .where(
      and(
        eq(fsrsCards.userId, userId),
        eq(fsrsCards.itemType, itemType),
        eq(fsrsCards.itemId, itemId),
      ),
    )
    .limit(1);

  const found = existing[0];
  if (found) return found.id;

  const empty = createEmptyCard();
  const id = newId('card');

  await db.insert(fsrsCards).values({
    id,
    userId,
    itemType,
    itemId,
    certificationId,
    due: Math.floor(empty.due.getTime() / 1000),
    stability: empty.stability,
    difficulty: empty.difficulty,
    elapsedDays: empty.elapsed_days,
    scheduledDays: empty.scheduled_days,
    reps: empty.reps,
    lapses: empty.lapses,
    state: empty.state,
    lastReview: null,
  });

  return id;
}

/**
 * Verwerkt een beoordeling en plant de volgende herhaling.
 *
 * @returns het aantal seconden tot de volgende herhaling
 */
export async function reviewCard(
  cardId: string,
  rating: ReviewRating,
  durationMs = 0,
): Promise<{ nextDue: number; scheduledDays: number }> {
  const rows = await db
    .select()
    .from(fsrsCards)
    .where(eq(fsrsCards.id, cardId))
    .limit(1);

  const row = rows[0];
  if (!row) throw new Error(`Onbekende kaart: ${cardId}`);

  const now = new Date();
  const card = toFsrsCard(row);
  // ReviewRating (1-4) komt overeen met Grade: Again, Hard, Good, Easy.
  // Rating.Manual (0) valt daar bewust buiten en kan hier dus niet optreden.
  const result = scheduler.next(card, now, rating as unknown as Grade);
  const next = result.card;

  const nextDue = Math.floor(next.due.getTime() / 1000);

  await db
    .update(fsrsCards)
    .set({
      due: nextDue,
      stability: next.stability,
      difficulty: next.difficulty,
      elapsedDays: next.elapsed_days,
      scheduledDays: next.scheduled_days,
      reps: next.reps,
      lapses: next.lapses,
      state: next.state,
      lastReview: Math.floor(now.getTime() / 1000),
    })
    .where(eq(fsrsCards.id, cardId));

  await db.insert(fsrsReviews).values({
    cardId,
    userId: row.userId,
    rating,
    state: next.state,
    scheduledDays: next.scheduled_days,
    elapsedDays: next.elapsed_days,
    durationMs,
  });

  return { nextDue, scheduledDays: next.scheduled_days };
}

/** Toont per beoordeling wanneer de kaart terugkomt, vóór je kiest. */
export function previewIntervals(row: {
  due: number;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: number;
  lastReview: number | null;
}): Record<ReviewRating, number> {
  const card = toFsrsCard(row);
  const now = new Date();
  const scheduled = scheduler.repeat(card, now);

  const forRating = (rating: Rating): number => {
    const entry = (scheduled as unknown as Record<number, { card: Card }>)[rating];
    if (!entry) return 0;
    return Math.max(
      0,
      Math.round((entry.card.due.getTime() - now.getTime()) / 1000),
    );
  };

  return {
    1: forRating(Rating.Again),
    2: forRating(Rating.Hard),
    3: forRating(Rating.Good),
    4: forRating(Rating.Easy),
  };
}

/** Kaarten die nu herhaald moeten worden, oudste eerst. */
export async function getDueCards(
  userId: string,
  options: {
    certificationId?: string;
    itemType?: 'question' | 'term';
    limit?: number;
  } = {},
): Promise<DueCard[]> {
  const now = Math.floor(Date.now() / 1000);
  const filters = [
    eq(fsrsCards.userId, userId),
    lte(fsrsCards.due, now),
    eq(fsrsCards.suspended, false),
  ];
  if (options.certificationId) {
    filters.push(eq(fsrsCards.certificationId, options.certificationId));
  }
  if (options.itemType) {
    filters.push(eq(fsrsCards.itemType, options.itemType));
  }

  const rows = await db
    .select({
      cardId: fsrsCards.id,
      itemType: fsrsCards.itemType,
      itemId: fsrsCards.itemId,
      certificationId: fsrsCards.certificationId,
      due: fsrsCards.due,
      state: fsrsCards.state,
      reps: fsrsCards.reps,
      lapses: fsrsCards.lapses,
    })
    .from(fsrsCards)
    .where(and(...filters))
    .orderBy(fsrsCards.due)
    .limit(options.limit ?? 50);

  return rows;
}

export async function countDueCards(
  userId: string,
  certificationId?: string,
): Promise<number> {
  const now = Math.floor(Date.now() / 1000);
  const filters = [
    eq(fsrsCards.userId, userId),
    lte(fsrsCards.due, now),
    eq(fsrsCards.suspended, false),
  ];
  if (certificationId) filters.push(eq(fsrsCards.certificationId, certificationId));

  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(fsrsCards)
    .where(and(...filters));

  return rows[0]?.count ?? 0;
}

/**
 * Koppelt de uitkomst van een oefen- of examenvraag aan het herhaalschema.
 *
 * Een fout antwoord telt als 'Again' (opnieuw leren), een goed antwoord als
 * 'Good'. Zo bouwt elke oefensessie automatisch je herhaalwachtrij op zonder
 * dat je zelf kaarten hoeft aan te maken.
 */
export async function recordAnswerAsReview(
  userId: string,
  questionId: string,
  certificationId: string,
  correct: boolean,
  durationMs = 0,
): Promise<void> {
  const cardId = await ensureCard(userId, 'question', questionId, certificationId);
  await reviewCard(cardId, correct ? 3 : 1, durationMs);
}

/** Verwijdert kaarten van vragen die niet meer bestaan of inactief zijn. */
export async function pruneOrphanedCards(validQuestionIds: string[]): Promise<void> {
  if (validQuestionIds.length === 0) return;
  await db
    .delete(fsrsCards)
    .where(
      and(
        eq(fsrsCards.itemType, 'question'),
        sql`${fsrsCards.itemId} NOT IN ${inArray(fsrsCards.itemId, validQuestionIds)}`,
      ),
    );
}

/** Menselijke weergave van een interval, bijvoorbeeld '3 d' of '10 min'. */
export function formatInterval(seconds: number, locale: 'nl' | 'en'): string {
  if (seconds < 60) return locale === 'nl' ? '< 1 min' : '< 1 min';
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} ${locale === 'nl' ? 'u' : 'h'}`;
  const days = Math.round(seconds / 86400);
  if (days < 31) return `${days} ${locale === 'nl' ? 'd' : 'd'}`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} ${locale === 'nl' ? 'mnd' : 'mo'}`;
  return `${(days / 365).toFixed(1)} ${locale === 'nl' ? 'jr' : 'y'}`;
}
