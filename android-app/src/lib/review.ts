import {
  getQuestion,
  getTerm,
  termsFor,
  pick,
  pickAlt,
  type Locale,
} from './content';
import { getDueCards, ensureCards, type ReviewRating } from './srs';

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

export type { ReviewRating };

/** Haalt de kaarten op die nu aan de beurt zijn, inclusief hun inhoud. */
export async function getReviewQueue(
  locale: Locale,
  limit = 25,
): Promise<ReviewItem[]> {
  const due = await getDueCards({ limit });
  const items: ReviewItem[] = [];

  for (const card of due) {
    if (card.itemType === 'question') {
      const question = getQuestion(card.itemId);
      // Een kaart voor een verwijderde vraag stilletjes overslaan is beter dan
      // een lege kaart tonen.
      if (!question) continue;

      items.push({
        cardId: card.cardId,
        itemType: 'question',
        certificationId: card.certificationId,
        reps: card.reps,
        lapses: card.lapses,
        question: {
          stem: pick(locale, question.stemNl, question.stemEn),
          stemAlt: pickAlt(locale, question.stemNl, question.stemEn),
          listItems:
            question.listItems?.map((li) => ({
              text: pick(locale, li.nl, li.en),
              textAlt: pickAlt(locale, li.nl, li.en),
            })) ?? null,
          options: [...question.options]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((option, index) => ({
              id: option.id,
              label: ['A', 'B', 'C', 'D'][index] ?? String.fromCharCode(65 + index),
              text: pick(locale, option.textNl, option.textEn),
              isCorrect: option.isCorrect,
              rationale: locale === 'nl' ? option.rationaleNl : option.rationaleEn,
            })),
          explanation: pick(locale, question.explanationNl, question.explanationEn),
          objectiveCode: question.objectiveCode,
        },
      });
    } else {
      const term = getTerm(card.itemId);
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
          definition: pick(locale, term.definitionNl, term.definitionEn),
          definitionAlt: pickAlt(locale, term.definitionNl, term.definitionEn),
          note: locale === 'nl' ? term.noteNl : term.noteEn,
        },
      });
    }
  }

  return items;
}

/**
 * Zet begrippen van een certificering in de herhaalwachtrij.
 *
 * Nieuwe kaarten zijn direct 'due', dus ze komen in de eerstvolgende sessie
 * langs. Bestaande kaarten blijven ongemoeid, zodat je voortgang niet reset.
 */
export async function addGlossaryToReview(
  certificationId: string,
): Promise<{ added: number }> {
  const terms = termsFor(certificationId);
  const added = await ensureCards(
    'term',
    terms.map((term) => term.id),
    certificationId,
  );
  return { added };
}
