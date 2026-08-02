'use client';

import { useEffect, useState, useTransition } from 'react';

import type { LoadedAttempt, LoadedQuestion } from '@/lib/exam/load';
import { saveAnswer, submitAttempt, type AnswerResult } from '@/app/actions/exam';

/**
 * Oefenmodus.
 *
 * Het omgekeerde van de examenmodus: geen tijdsdruk, wel directe feedback met
 * de toelichting én de rationale bij elke afleider. Je leert het meest van
 * begrijpen waarom de drie andere opties níét kloppen.
 *
 * Elk beantwoord item gaat automatisch de herhaalwachtrij in: fout is 'Again',
 * goed is 'Good'. Je hoeft dus niets zelf te plannen.
 */

interface Labels {
  question: string;
  of: string;
  check: string;
  continue: string;
  finish: string;
  explanation: string;
  correct: string;
  incorrect: string;
  objective: string;
  source: string;
  showAlt: string;
}

export function PracticeRunner({
  attempt,
  labels,
}: {
  attempt: LoadedAttempt;
  labels: Labels;
}) {
  const [questions] = useState<LoadedQuestion[]>(attempt.questions);
  const [current, setCurrent] = useState(() => {
    // Hervat bij de eerste onbeantwoorde vraag.
    const index = attempt.questions.findIndex((q) => q.selectedOptionId === null);
    return index === -1 ? 0 : index;
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<AnswerResult['feedback'] | null>(null);
  const [showAlt, setShowAlt] = useState(false);
  const [checking, setChecking] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [, startTransition] = useTransition();

  const question = questions[current];

  useEffect(() => {
    setSelected(null);
    setFeedback(null);
    setShowAlt(false);
    setStartedAt(Date.now());
  }, [current]);

  if (!question) return null;

  const check = async () => {
    if (selected === null || checking) return;
    setChecking(true);
    const result = await saveAnswer({
      attemptId: attempt.id,
      position: question.position,
      optionId: selected,
      timeSpentMs: Date.now() - startedAt,
    });
    setChecking(false);
    if (result.feedback) setFeedback(result.feedback);
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      startTransition(() => {
        void submitAttempt(attempt.id, false);
      });
    }
  };

  const isLast = current === questions.length - 1;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium">
          {labels.question} {current + 1} {labels.of} {questions.length}
        </p>
        <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
          {labels.objective} {question.objectiveCode}
        </span>
      </div>

      <div
        className="mb-5 h-1 overflow-hidden rounded-full"
        style={{ background: 'var(--surface-hover)' }}
      >
        <div
          className="h-full transition-[width] duration-200"
          style={{
            width: `${((current + 1) / questions.length) * 100}%`,
            background: 'var(--accent)',
          }}
        />
      </div>

      <div className="p115-card p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span
            className="p115-badge"
            style={{ background: 'var(--surface-hover)', color: 'var(--text-muted)' }}
          >
            {question.domainCode}. {question.domainTitle}
          </span>
          <button
            type="button"
            className="p115-btn p115-btn-ghost px-2 py-1 text-xs"
            onClick={() => setShowAlt((v) => !v)}
          >
            {labels.showAlt}
          </button>
        </div>

        <p className="whitespace-pre-line text-lg leading-relaxed">{question.stem}</p>
        {showAlt ? (
          <p
            className="mt-2 whitespace-pre-line border-l-2 pl-3 text-base leading-relaxed"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border-strong)' }}
          >
            {question.stemAlt}
          </p>
        ) : null}

        {question.listItems ? (
          <ol className="mt-4 space-y-1.5 text-[0.9375rem]">
            {question.listItems.map((item, index) => (
              <li key={index} className="flex gap-2.5">
                <span className="font-semibold tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {index + 1}.
                </span>
                <span>{item.text}</span>
              </li>
            ))}
          </ol>
        ) : null}

        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label={question.stem}>
          {question.options.map((option) => {
            const isSelected = selected === option.id;
            let state: string | undefined;
            if (feedback) {
              if (option.id === feedback.correctOptionId) state = 'correct';
              else if (isSelected) state = 'incorrect';
            }

            const rationale = feedback?.rationales[option.id];

            return (
              <div key={option.id}>
                <button
                  type="button"
                  className="p115-option"
                  data-selected={isSelected && !feedback}
                  data-state={state}
                  role="radio"
                  aria-checked={isSelected}
                  disabled={feedback !== null}
                  onClick={() => setSelected(option.id)}
                >
                  <span className="p115-option-label" aria-hidden="true">
                    {option.label}
                  </span>
                  <span className="pt-0.5 text-[0.9375rem] leading-relaxed">
                    {option.text}
                    {showAlt ? (
                      <span className="block text-sm" style={{ color: 'var(--text-muted)' }}>
                        {option.textAlt}
                      </span>
                    ) : null}
                  </span>
                </button>
                {feedback && rationale && option.id !== feedback.correctOptionId ? (
                  <p
                    className="mt-1.5 pl-4 text-xs leading-relaxed"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {rationale}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        {feedback ? (
          <div className="mt-5">
            <div
              className="mb-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold"
              style={
                feedback.correct
                  ? { background: 'var(--success-soft)', color: 'var(--success)' }
                  : { background: 'var(--danger-soft)', color: 'var(--danger)' }
              }
              role="status"
            >
              {feedback.correct ? labels.correct : labels.incorrect}
            </div>

            <div
              className="rounded-lg p-4 text-sm leading-relaxed"
              style={{ background: 'var(--info-soft)' }}
            >
              <p
                className="mb-1.5 text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--info)' }}
              >
                {labels.explanation}
              </p>
              {feedback.explanation}
              {question.sourceRef ? (
                <p className="mt-2 text-xs" style={{ color: 'var(--text-subtle)' }}>
                  {labels.source}: {question.sourceRef}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex justify-end gap-2 border-t pt-4">
          {feedback ? (
            <button type="button" className="p115-btn p115-btn-primary" onClick={next}>
              {isLast ? labels.finish : labels.continue}
            </button>
          ) : (
            <button
              type="button"
              className="p115-btn p115-btn-primary"
              onClick={() => void check()}
              disabled={selected === null || checking}
            >
              {labels.check}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
