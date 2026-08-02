'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { gradeCard, type ReviewItem } from '@/app/actions/review';
import type { ReviewRating } from '@/lib/srs';

/**
 * Herhaalsessie.
 *
 * Bij een vraagkaart kies je eerst een antwoord; het systeem stelt op basis
 * daarvan een beoordeling voor (fout wordt 'Opnieuw', goed wordt 'Goed'), maar
 * je mag corrigeren — soms had je het goed geraden, en dan is 'Moeilijk'
 * eerlijker tegenover je eigen geheugen.
 *
 * Bij een begripkaart draai je de kaart om en beoordeel je zelf.
 */

interface Labels {
  again: string;
  hard: string;
  good: string;
  easy: string;
  showAnswer: string;
  explanation: string;
  correct: string;
  incorrect: string;
  done: string;
  remaining: string;
}

const RATING_TONES: Record<ReviewRating, { bg: string; color: string }> = {
  1: { bg: 'var(--danger-soft)', color: 'var(--danger)' },
  2: { bg: 'var(--warning-soft)', color: 'var(--warning)' },
  3: { bg: 'var(--success-soft)', color: 'var(--success)' },
  4: { bg: 'var(--info-soft)', color: 'var(--info)' },
};

export function ReviewRunner({
  items,
  labels,
}: {
  items: ReviewItem[];
  labels: Labels;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);

  const item = items[index];

  if (!item) {
    return (
      <div className="p115-card p-8 text-center">
        <p className="font-medium">{labels.done}</p>
        <button
          type="button"
          className="p115-btn p115-btn-primary mt-4"
          onClick={() => router.refresh()}
        >
          {labels.remaining}
        </button>
      </div>
    );
  }

  const grade = async (rating: ReviewRating) => {
    if (busy) return;
    setBusy(true);
    await gradeCard({
      cardId: item.cardId,
      rating,
      durationMs: Math.min(Date.now() - startedAt, 600_000),
    });
    setBusy(false);

    if (index < items.length - 1) {
      setIndex(index + 1);
      setRevealed(false);
      setSelected(null);
      setStartedAt(Date.now());
    } else {
      // Wachtrij leeg: opnieuw ophalen, want er kunnen kaarten bij zijn gekomen.
      router.refresh();
      setIndex(index + 1);
    }
  };

  const correctOption = item.question?.options.find((o) => o.isCorrect);
  const answeredCorrectly =
    selected !== null && correctOption !== undefined && selected === correctOption.id;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span style={{ color: 'var(--text-muted)' }}>
          {index + 1} / {items.length}
        </span>
        {item.itemType === 'question' && item.question ? (
          <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
            {item.question.objectiveCode}
          </span>
        ) : null}
      </div>

      <div
        className="mb-5 h-1 overflow-hidden rounded-full"
        style={{ background: 'var(--surface-hover)' }}
      >
        <div
          className="h-full transition-[width] duration-200"
          style={{
            width: `${(index / items.length) * 100}%`,
            background: 'var(--accent)',
          }}
        />
      </div>

      <div className="p115-card p-6">
        {item.itemType === 'question' && item.question ? (
          <>
            <p className="whitespace-pre-line text-lg leading-relaxed">
              {item.question.stem}
            </p>

            {item.question.listItems ? (
              <ol className="mt-4 space-y-1.5 text-[0.9375rem]">
                {item.question.listItems.map((li, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>
                      {i + 1}.
                    </span>
                    <span>{li.text}</span>
                  </li>
                ))}
              </ol>
            ) : null}

            <div className="mt-5 space-y-2.5">
              {item.question.options.map((option) => {
                const isSelected = selected === option.id;
                let state: string | undefined;
                if (revealed) {
                  if (option.isCorrect) state = 'correct';
                  else if (isSelected) state = 'incorrect';
                }
                return (
                  <button
                    key={option.id}
                    type="button"
                    className="p115-option"
                    data-selected={isSelected && !revealed}
                    data-state={state}
                    disabled={revealed}
                    onClick={() => {
                      setSelected(option.id);
                      setRevealed(true);
                    }}
                  >
                    <span className="p115-option-label" aria-hidden="true">
                      {option.label}
                    </span>
                    <span className="pt-0.5 text-[0.9375rem] leading-relaxed">
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {revealed ? (
              <div
                className="mt-5 rounded-lg p-4 text-sm leading-relaxed"
                style={{ background: 'var(--info-soft)' }}
              >
                <p
                  className="mb-1.5 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--info)' }}
                >
                  {labels.explanation}
                </p>
                {item.question.explanation}
              </div>
            ) : null}
          </>
        ) : item.term ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-subtle)' }}>
              {item.term.termEn}
            </p>
            <p className="mt-1 text-xl font-semibold">{item.term.termNl}</p>

            {revealed ? (
              <div className="mt-4 space-y-3">
                <p className="text-[0.9375rem] leading-relaxed">{item.term.definition}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.term.definitionAlt}
                </p>
                {item.term.note ? (
                  <p
                    className="rounded-lg p-3 text-sm"
                    style={{ background: 'var(--warning-soft)', color: 'var(--text)' }}
                  >
                    {item.term.note}
                  </p>
                ) : null}
              </div>
            ) : (
              <button
                type="button"
                className="p115-btn p115-btn-secondary mt-5 w-full"
                onClick={() => setRevealed(true)}
              >
                {labels.showAnswer}
              </button>
            )}
          </>
        ) : null}

        {revealed ? (
          <div className="mt-6 border-t pt-4">
            {item.itemType === 'question' ? (
              <p className="mb-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                {answeredCorrectly ? labels.correct : labels.incorrect} &mdash; hoe goed wist
                je het?
              </p>
            ) : null}
            <div className="grid grid-cols-4 gap-2">
              {([1, 2, 3, 4] as ReviewRating[]).map((rating) => {
                const label = [labels.again, labels.hard, labels.good, labels.easy][
                  rating - 1
                ];
                const tone = RATING_TONES[rating];
                // Bij een fout antwoord is 'Opnieuw' de voor de hand liggende
                // keuze; die krijgt daarom nadruk.
                const suggested =
                  item.itemType === 'question' &&
                  ((answeredCorrectly && rating === 3) ||
                    (!answeredCorrectly && rating === 1));

                return (
                  <button
                    key={rating}
                    type="button"
                    className="rounded-lg px-2 py-2.5 text-sm font-medium transition-transform active:translate-y-px"
                    style={{
                      background: tone.bg,
                      color: tone.color,
                      outline: suggested ? `2px solid ${tone.color}` : undefined,
                      outlineOffset: suggested ? '1px' : undefined,
                    }}
                    disabled={busy}
                    onClick={() => void grade(rating)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
