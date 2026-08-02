'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';

import type { LoadedAttempt, LoadedQuestion } from '@/lib/exam/load';
import { saveAnswer, toggleFlag, submitAttempt } from '@/app/actions/exam';

/**
 * Examensimulator onder echte condities.
 *
 * Ontwerpkeuzes:
 * - De timer rekent met de servertijd van `startedAt`, niet met een lokale
 *   teller. Een tabblad dat in de achtergrond wordt geparkeerd of een
 *   herladen pagina levert daardoor geen extra tijd op.
 * - Antwoorden worden direct naar de server geschreven. Sluit je per ongeluk
 *   het tabblad, dan hervat je precies waar je was.
 * - Geen enkele terugkoppeling over juistheid tot na het inleveren.
 */

interface Labels {
  question: string;
  of: string;
  next: string;
  previous: string;
  flag: string;
  flagged: string;
  submit: string;
  submitConfirm: string;
  timeLeft: string;
  unanswered: string;
  answered: string;
  overview: string;
  timeUp: string;
  showAlt: string;
}

function formatClock(seconds: number): string {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ExamRunner({
  attempt,
  labels,
}: {
  attempt: LoadedAttempt;
  labels: Labels;
}) {
  const [questions, setQuestions] = useState<LoadedQuestion[]>(attempt.questions);
  const [current, setCurrent] = useState(0);
  const [showAlt, setShowAlt] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [, startTransition] = useTransition();

  const questionEnteredAt = useRef<number>(Date.now());
  const submittedRef = useRef(false);

  const deadline = useMemo(
    () =>
      attempt.timeLimitSeconds !== null
        ? (attempt.startedAt + attempt.timeLimitSeconds) * 1000
        : null,
    [attempt.startedAt, attempt.timeLimitSeconds],
  );

  const [remaining, setRemaining] = useState<number | null>(
    deadline !== null ? Math.floor((deadline - Date.now()) / 1000) : null,
  );

  const handleSubmit = useCallback(
    (auto: boolean) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      startTransition(() => {
        void submitAttempt(attempt.id, auto);
      });
    },
    [attempt.id],
  );

  // Timer. Elke seconde herberekend uit de deadline, niet afgeteld, zodat
  // afwijkingen door inactieve tabbladen zichzelf corrigeren.
  useEffect(() => {
    if (deadline === null) return;

    const tick = () => {
      const left = Math.floor((deadline - Date.now()) / 1000);
      setRemaining(left);
      if (left <= 0) handleSubmit(true);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadline, handleSubmit]);

  const question = questions[current];

  const persistAnswer = useCallback(
    (position: number, optionId: string | null) => {
      const spent = Date.now() - questionEnteredAt.current;
      questionEnteredAt.current = Date.now();
      void saveAnswer({
        attemptId: attempt.id,
        position,
        optionId,
        timeSpentMs: Math.min(spent, 3_600_000),
      });
    },
    [attempt.id],
  );

  const selectOption = (optionId: string) => {
    if (!question) return;
    const next = question.selectedOptionId === optionId ? null : optionId;

    setQuestions((prev) =>
      prev.map((q) =>
        q.position === question.position ? { ...q, selectedOptionId: next } : q,
      ),
    );
    persistAnswer(question.position, next);
  };

  const onToggleFlag = () => {
    if (!question) return;
    setQuestions((prev) =>
      prev.map((q) =>
        q.position === question.position ? { ...q, flagged: !q.flagged } : q,
      ),
    );
    void toggleFlag({ attemptId: attempt.id, position: question.position });
  };

  const goTo = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    questionEnteredAt.current = Date.now();
    setCurrent(index);
    setShowOverview(false);
    setShowAlt(false);
  };

  // Toetsenbordbediening: A-D om te antwoorden, pijltjes om te navigeren.
  // Sneller werken scheelt tijd, en tijd is bij dit examen de beperkende factor.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      const key = event.key.toLowerCase();
      const active = questions[current];
      if (!active) return;

      const optionIndex = ['a', 'b', 'c', 'd'].indexOf(key);
      if (optionIndex >= 0 && active.options[optionIndex]) {
        event.preventDefault();
        selectOption(active.options[optionIndex].id);
        return;
      }

      if (key === 'arrowright' || key === 'n') {
        event.preventDefault();
        goTo(current + 1);
      } else if (key === 'arrowleft' || key === 'p') {
        event.preventDefault();
        goTo(current - 1);
      } else if (key === 'f') {
        event.preventDefault();
        onToggleFlag();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const answeredCount = questions.filter((q) => q.selectedOptionId !== null).length;
  const unansweredCount = questions.length - answeredCount;
  const timeIsShort = remaining !== null && remaining <= 300;

  if (!question) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Kop met voortgang en timer */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            {labels.question} {current + 1} {labels.of} {questions.length}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {answeredCount} {labels.answered} &middot; {unansweredCount} {labels.unanswered}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {remaining !== null ? (
            <div
              className="rounded-lg px-3 py-1.5 text-lg font-semibold tabular-nums"
              style={
                timeIsShort
                  ? { background: 'var(--danger-soft)', color: 'var(--danger)' }
                  : { background: 'var(--surface-hover)', color: 'var(--text)' }
              }
              role="timer"
              aria-live={timeIsShort ? 'polite' : 'off'}
              aria-label={labels.timeLeft}
            >
              {formatClock(remaining)}
            </div>
          ) : null}
          <button
            type="button"
            className="p115-btn p115-btn-secondary px-3 py-1.5 text-sm"
            onClick={() => setShowOverview((v) => !v)}
            aria-expanded={showOverview}
          >
            {labels.overview}
          </button>
        </div>
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

      {showOverview ? (
        <div className="p115-card mb-5 p-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-2">
            {questions.map((q, index) => (
              <button
                key={q.position}
                type="button"
                className="p115-nav-dot"
                data-answered={q.selectedOptionId !== null}
                data-current={index === current}
                data-flagged={q.flagged}
                onClick={() => goTo(index)}
                aria-label={`${labels.question} ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* De vraag */}
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
                <span
                  className="font-semibold tabular-nums"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {index + 1}.
                </span>
                <span>
                  {item.text}
                  {showAlt ? (
                    <span className="block text-sm" style={{ color: 'var(--text-muted)' }}>
                      {item.textAlt}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        ) : null}

        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label={question.stem}>
          {question.options.map((option) => {
            const selected = question.selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className="p115-option"
                data-selected={selected}
                role="radio"
                aria-checked={selected}
                onClick={() => selectOption(option.id)}
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
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between border-t pt-4">
          <button
            type="button"
            className="p115-btn p115-btn-ghost text-sm"
            onClick={onToggleFlag}
            aria-pressed={question.flagged}
            style={question.flagged ? { color: 'var(--warning)' } : undefined}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M3 1v14M3 2h9l-2 3 2 3H3"
                fill={question.flagged ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            {question.flagged ? labels.flagged : labels.flag}
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              className="p115-btn p115-btn-secondary text-sm"
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
            >
              {labels.previous}
            </button>
            {current < questions.length - 1 ? (
              <button
                type="button"
                className="p115-btn p115-btn-primary text-sm"
                onClick={() => goTo(current + 1)}
              >
                {labels.next}
              </button>
            ) : (
              <button
                type="button"
                className="p115-btn p115-btn-primary text-sm"
                onClick={() => setConfirming(true)}
              >
                {labels.submit}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          className="p115-btn p115-btn-ghost text-sm"
          onClick={() => setConfirming(true)}
        >
          {labels.submit}
        </button>
      </div>

      {confirming ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          style={{ background: 'rgb(0 0 0 / 0.5)' }}
          role="dialog"
          aria-modal="true"
        >
          <div className="p115-card w-full max-w-sm p-5">
            <p className="font-medium">{labels.submit}</p>
            <p className="mt-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
              {labels.submitConfirm}
            </p>
            {unansweredCount > 0 ? (
              <p
                className="mt-3 rounded-lg px-3 py-2 text-sm"
                style={{ background: 'var(--warning-soft)', color: 'var(--warning)' }}
              >
                {unansweredCount} {labels.unanswered}
              </p>
            ) : null}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="p115-btn p115-btn-secondary text-sm"
                onClick={() => setConfirming(false)}
              >
                {labels.previous}
              </button>
              <button
                type="button"
                className="p115-btn p115-btn-primary text-sm"
                onClick={() => handleSubmit(false)}
              >
                {labels.submit}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
