'use server';

import { revalidatePath } from 'next/cache';
import { eq, and, inArray } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { fsrsCards, glossaryTerms } from '@/db/schema';
import { requireUser } from '@/lib/auth/session';
import { getDueCards, reviewCard, ensureCard, type ReviewRating } from '@/lib/srs';
import type { Locale } from '@/lib/i18n';

/**
 * Herhaalwachtrij.
 *
 * Twee soorten kaarten in één wachtrij: examenvragen (waarbij je een antwoord
 * kiest) en begrippen uit het glossarium (klassieke flashcard, omdraaien en
 * zelf beoordelen). Ze delen hetzelfde FSRS-schema, zodat de dagelijkse
 * planning klopt over beide soorten heen.
 */

export interface ReviewItem {
  cardId: string;
  itemType: 'question' | 'term';
  certificationId: string;
  reps: number;
  lapses: number;
  /** Vraagkaart */
  question?: {
    stem: string;
    stemAlt: string;
    listItems: Array<{ text: string; textAlt: string }> | null;
    options: Array<{
      id: string;
      label: string;
      text: string;
      isCorrect: boolean;
      rationale: string | null;
    }>;
    explanation: string;
    objectiveCode: string;
  };
  /** Begripkaart */
  term?: {
    termEn: string;
    termNl: string;
    definition: string;
    definitionAlt: string;
    note: string | null;
  };
}

/** Haalt de kaarten op die nu aan de beurt zijn, inclusief hun inhoud. */
export async function getReviewQueue(
  locale: Locale,
  limit = 25,
): Promise<ReviewItem[]> {
  const session = await requireUser();
  if (!session) return [];

  const due = await getDueCards(session.user.id, { limit });
  if (due.length === 0) return [];

  const questionIds = due.filter((c) => c.itemType === 'question').map((c) => c.itemId);
  const termIds = due.filter((c) => c.itemType === 'term').map((c) => c.itemId);

  const questionRows =
    questionIds.length > 0
      ? await db.query.questions.findMany({
          where: (q, { inArray: within, and: both, eq: equals }) =>
            both(within(q.id, questionIds), equals(q.active, true)),
          with: { options: true, objective: true },
        })
      : [];

  const termRows =
    termIds.length > 0
      ? await db.select().from(glossaryTerms).where(inArray(glossaryTerms.id, termIds))
      : [];

  const questionMap = new Map(questionRows.map((q) => [q.id, q]));
  const termMap = new Map(termRows.map((t) => [t.id, t]));

  const labels = ['A', 'B', 'C', 'D'];
  const items: ReviewItem[] = [];

  for (const card of due) {
    if (card.itemType === 'question') {
      const question = questionMap.get(card.itemId);
      // Een kaart voor een verwijderde of gedeactiveerde vraag stilletjes
      // overslaan is beter dan een lege kaart tonen.
      if (!question) continue;

      const listItemsRaw: Array<{ nl: string; en: string }> | null = question.listItems
        ? JSON.parse(question.listItems)
        : null;

      items.push({
        cardId: card.cardId,
        itemType: 'question',
        certificationId: card.certificationId,
        reps: card.reps,
        lapses: card.lapses,
        question: {
          stem: locale === 'nl' ? question.stemNl : question.stemEn,
          stemAlt: locale === 'nl' ? question.stemEn : question.stemNl,
          listItems:
            listItemsRaw?.map((li) => ({
              text: locale === 'nl' ? li.nl : li.en,
              textAlt: locale === 'nl' ? li.en : li.nl,
            })) ?? null,
          options: [...question.options]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((option, index) => ({
              id: option.id,
              label: labels[index] ?? String.fromCharCode(65 + index),
              text: locale === 'nl' ? option.textNl : option.textEn,
              isCorrect: option.isCorrect,
              rationale: locale === 'nl' ? option.rationaleNl : option.rationaleEn,
            })),
          explanation: locale === 'nl' ? question.explanationNl : question.explanationEn,
          objectiveCode: question.objective.code,
        },
      });
    } else {
      const term = termMap.get(card.itemId);
      if (!term) continue;

      items.push({
        cardId: card.cardId,
        itemType: 'term',
        certificationId: card.certificationId,
        reps: card.reps,
        lapses: card.lapses,
        term: {
          termEn: term.termEn,
          termNl: term.termNl,
          definition: locale === 'nl' ? term.definitionNl : term.definitionEn,
          definitionAlt: locale === 'nl' ? term.definitionEn : term.definitionNl,
          note: locale === 'nl' ? term.noteNl : term.noteEn,
        },
      });
    }
  }

  return items;
}

const gradeSchema = z.object({
  cardId: z.string().min(1).max(64),
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  durationMs: z.number().int().min(0).max(600_000).default(0),
});

export async function gradeCard(input: {
  cardId: string;
  rating: ReviewRating;
  durationMs?: number;
}): Promise<{ ok: boolean; nextDue?: number; error?: string }> {
  const session = await requireUser();
  if (!session) return { ok: false, error: 'Niet ingelogd.' };

  const parsed = gradeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Ongeldige invoer.' };

  // Eigendom controleren: een geraden kaart-id mag niet andermans schema raken.
  const owned = await db
    .select({ id: fsrsCards.id })
    .from(fsrsCards)
    .where(and(eq(fsrsCards.id, parsed.data.cardId), eq(fsrsCards.userId, session.user.id)))
    .limit(1);

  if (!owned[0]) return { ok: false, error: 'Kaart niet gevonden.' };

  const result = await reviewCard(
    parsed.data.cardId,
    parsed.data.rating,
    parsed.data.durationMs,
  );

  return { ok: true, nextDue: result.nextDue };
}

/**
 * Zet begrippen van een certificering in de herhaalwachtrij.
 *
 * Nieuwe kaarten zijn direct 'due', dus ze komen in de eerstvolgende sessie
 * langs. Bestaande kaarten blijven ongemoeid, zodat je voortgang niet reset.
 */
export async function addGlossaryToReview(
  certificationId: string,
): Promise<{ ok: boolean; added: number }> {
  const session = await requireUser();
  if (!session) return { ok: false, added: 0 };

  const terms = await db
    .select({ id: glossaryTerms.id })
    .from(glossaryTerms)
    .where(eq(glossaryTerms.certificationId, certificationId));

  const existing = await db
    .select({ itemId: fsrsCards.itemId })
    .from(fsrsCards)
    .where(
      and(
        eq(fsrsCards.userId, session.user.id),
        eq(fsrsCards.itemType, 'term'),
        eq(fsrsCards.certificationId, certificationId),
      ),
    );

  const existingIds = new Set(existing.map((e) => e.itemId));
  let added = 0;

  for (const term of terms) {
    if (existingIds.has(term.id)) continue;
    await ensureCard(session.user.id, 'term', term.id, certificationId);
    added++;
  }

  revalidatePath('/review');
  revalidatePath('/glossary');
  return { ok: true, added };
}

/** Haalt een kaart uit de roulatie zonder de historie te wissen. */
export async function suspendCard(cardId: string): Promise<{ ok: boolean }> {
  const session = await requireUser();
  if (!session) return { ok: false };

  await db
    .update(fsrsCards)
    .set({ suspended: true })
    .where(and(eq(fsrsCards.id, cardId), eq(fsrsCards.userId, session.user.id)));

  return { ok: true };
}
