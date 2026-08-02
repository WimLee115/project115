import {
  fsrs,
  generatorParameters,
  Rating,
  State,
  createEmptyCard,
  type Card,
  type Grade,
} from 'ts-fsrs';

import { newId } from './id';
import {
  getCard,
  getCardByItem,
  allCards,
  putCard,
  putCards,
  saveReview,
  reviewsSince,
  type FsrsCardRow,
} from './store';

/**
 * Spaced repetition met FSRS.
 *
 * Dezelfde parameters als de webversie: `request_retention` op 0,9 en een
 * maximaal interval van een jaar. Dat is bewust — wie op beide apparaten
 * studeert en zijn voortgang uitwisselt, moet niet twee verschillende
 * herhaalschema's krijgen.
 *
 * Wat hier wél anders is: de planning rekent op het toestel zelf, dus zonder
 * server. Het gevolg is dat de klok van je telefoon de waarheid is. Zet je die
 * handmatig vooruit, dan komen kaarten te vroeg langs; dat is een prijs die
 * offline werken nu eenmaal met zich meebrengt.
 */

const params = generatorParameters({
  request_retention: 0.9,
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

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function toFsrsCard(row: FsrsCardRow): Card {
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
  itemType: 'question' | 'term',
  itemId: string,
  certificationId: string,
): Promise<string> {
  const existing = await getCardByItem(itemType, itemId);
  if (existing) return existing.id;

  const empty = createEmptyCard();
  const id = newId('card');

  await putCard({
    id,
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
    suspended: false,
  });

  return id;
}

/** Maakt in één keer kaarten aan voor een reeks items die er nog geen hebben. */
export async function ensureCards(
  itemType: 'question' | 'term',
  itemIds: string[],
  certificationId: string,
): Promise<number> {
  const existing = await allCards();
  const known = new Set(
    existing.filter((c) => c.itemType === itemType).map((c) => c.itemId),
  );

  const fresh: FsrsCardRow[] = [];
  for (const itemId of itemIds) {
    if (known.has(itemId)) continue;
    known.add(itemId);

    const empty = createEmptyCard();
    fresh.push({
      id: newId('card'),
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
      suspended: false,
    });
  }

  await putCards(fresh);
  return fresh.length;
}

/**
 * Verwerkt een beoordeling en plant de volgende herhaling.
 *
 * @returns het tijdstip van de volgende herhaling en het interval in dagen
 */
export async function reviewCard(
  cardId: string,
  rating: ReviewRating,
  durationMs = 0,
): Promise<{ nextDue: number; scheduledDays: number }> {
  const row = await getCard(cardId);
  if (!row) throw new Error(`Onbekende kaart: ${cardId}`);

  const now = new Date();
  const card = toFsrsCard(row);
  // ReviewRating (1-4) komt overeen met Grade: Again, Hard, Good, Easy.
  // Rating.Manual (0) valt daar bewust buiten en kan hier dus niet optreden.
  const result = scheduler.next(card, now, rating as unknown as Grade);
  const next = result.card;

  const nextDue = Math.floor(next.due.getTime() / 1000);

  await saveReview(
    {
      ...row,
      due: nextDue,
      stability: next.stability,
      difficulty: next.difficulty,
      elapsedDays: next.elapsed_days,
      scheduledDays: next.scheduled_days,
      reps: next.reps,
      lapses: next.lapses,
      state: next.state,
      lastReview: Math.floor(now.getTime() / 1000),
    },
    {
      cardId,
      rating,
      state: next.state,
      scheduledDays: next.scheduled_days,
      elapsedDays: next.elapsed_days,
      reviewedAt: nowSeconds(),
      durationMs,
    },
  );

  return { nextDue, scheduledDays: next.scheduled_days };
}

/** Toont per beoordeling wanneer de kaart terugkomt, vóór je kiest. */
export function previewIntervals(row: FsrsCardRow): Record<ReviewRating, number> {
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
  options: {
    certificationId?: string;
    itemType?: 'question' | 'term';
    limit?: number;
  } = {},
): Promise<DueCard[]> {
  const now = nowSeconds();
  const cards = await allCards();

  return cards
    .filter((card) => {
      if (card.suspended) return false;
      if (card.due > now) return false;
      if (options.certificationId && card.certificationId !== options.certificationId) {
        return false;
      }
      if (options.itemType && card.itemType !== options.itemType) return false;
      return true;
    })
    .sort((a, b) => a.due - b.due)
    .slice(0, options.limit ?? 50)
    .map((card) => ({
      cardId: card.id,
      itemType: card.itemType,
      itemId: card.itemId,
      certificationId: card.certificationId,
      due: card.due,
      state: card.state,
      reps: card.reps,
      lapses: card.lapses,
    }));
}

export async function countDueCards(certificationId?: string): Promise<number> {
  const now = nowSeconds();
  const cards = await allCards();
  return cards.filter(
    (card) =>
      !card.suspended &&
      card.due <= now &&
      (!certificationId || card.certificationId === certificationId),
  ).length;
}

/** Aantal herhalingen sinds middernacht lokale tijd, voor het dagdoel. */
export async function countReviewsToday(): Promise<number> {
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  const reviews = await reviewsSince(Math.floor(midnight.getTime() / 1000));
  return reviews.length;
}

/**
 * Koppelt de uitkomst van een oefen- of examenvraag aan het herhaalschema.
 *
 * Een fout antwoord telt als 'Again' (opnieuw leren), een goed antwoord als
 * 'Good'. Zo bouwt elke oefensessie automatisch je herhaalwachtrij op zonder
 * dat je zelf kaarten hoeft aan te maken.
 */
export async function recordAnswerAsReview(
  questionId: string,
  certificationId: string,
  correct: boolean,
  durationMs = 0,
): Promise<void> {
  const cardId = await ensureCard('question', questionId, certificationId);
  await reviewCard(cardId, correct ? 3 : 1, durationMs);
}

/** Haalt een kaart uit de roulatie zonder de historie te wissen. */
export async function suspendCard(cardId: string): Promise<void> {
  const card = await getCard(cardId);
  if (!card) return;
  await putCard({ ...card, suspended: true });
}

/** Menselijke weergave van een interval, bijvoorbeeld '3 d' of '10 min'. */
export function formatInterval(seconds: number, locale: 'nl' | 'en'): string {
  if (seconds < 60) return '< 1 min';
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} ${locale === 'nl' ? 'u' : 'h'}`;
  const days = Math.round(seconds / 86400);
  if (days < 31) return `${days} d`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} ${locale === 'nl' ? 'mnd' : 'mo'}`;
  return `${(days / 365).toFixed(1)} ${locale === 'nl' ? 'jr' : 'y'}`;
}
