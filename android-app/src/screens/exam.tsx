import { useCallback, useEffect, useRef, useState } from 'react';

import { useApp } from '@/app/app-state';
import { OptionButton, QuestionStem } from '@/components/question';
import { Badge, ErrorNote, Loading, ProgressBar, Sheet, TopBar } from '@/components/ui';
import {
  loadAttempt,
  saveAnswer,
  submitAttempt,
  toggleFlag,
  type LoadedAttempt,
} from '@/lib/exam';
import { formatClock } from '@/lib/format';
import { alarm } from '@/lib/haptics';
import { useRouter } from '@/lib/router';
import { useAsync } from '@/lib/use-async';

/**
 * Het proefexamen.
 *
 * Zo dicht mogelijk bij de echte afname: één taal, geen toelichting, geen
 * signaal of een antwoord goed was, en een klok die doorloopt. Wat de app wél
 * doet en het echte examen ook: je kunt vragen markeren en in willekeurige
 * volgorde langs.
 *
 * Elk antwoord gaat direct naar de opslag. Een lege batterij halverwege kost je
 * dan hooguit de laatste vraag, niet het hele examen.
 */

/** Onder deze grens kleurt de klok; eerst amber, dan rood. */
const WARNING_SECONDS = 300;
const DANGER_SECONDS = 60;

export function ExamScreen({ attemptId }: { attemptId: string }) {
  const { t } = useApp();
  const { navigate } = useRouter();
  const { data, error, loading, reload } = useAsync(
    () => loadAttempt(attemptId),
    [attemptId],
  );

  // Een afgeronde poging heeft geen examen meer maar een rapport; daar hoort de
  // gebruiker dan ook heen, ook als hij via de geschiedenis terugkomt.
  useEffect(() => {
    if (data && data.finishedAt !== null) {
      navigate(`/result/${attemptId}`, { replace: true });
    }
  }, [data, attemptId, navigate]);

  if (loading) return <Loading label={t('common.loading')} />;

  if (error || !data) {
    return (
      <div className="pt-5">
        <TopBar title={t('nav.exam')} onBack={() => navigate('/')} />
        <ErrorNote
          message={t('common.error')}
          onRetry={reload}
          retryLabel={t('common.confirm')}
        />
      </div>
    );
  }

  if (data.finishedAt !== null) return <Loading />;

  return <ExamRunner attempt={data} />;
}

function ExamRunner({ attempt }: { attempt: LoadedAttempt }) {
  const { t } = useApp();
  const { navigate } = useRouter();

  const total = attempt.questions.length;

  // Hervatten bij de eerste onbeantwoorde vraag; opnieuw bij vraag 1 beginnen
  // kost tijd die je tijdens een examen niet hebt.
  const [index, setIndex] = useState(() => {
    const first = attempt.questions.findIndex((row) => row.selectedOptionId === null);
    return first === -1 ? 0 : first;
  });

  const [answers, setAnswers] = useState<Record<number, string | null>>(() =>
    Object.fromEntries(attempt.questions.map((row) => [row.position, row.selectedOptionId])),
  );
  const [flags, setFlags] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(attempt.questions.map((row) => [row.position, row.flagged])),
  );

  const [remaining, setRemaining] = useState<number | null>(() =>
    attempt.timeLimitSeconds === null
      ? null
      : attempt.startedAt + attempt.timeLimitSeconds - Math.floor(Date.now() / 1000),
  );

  const [sheet, setSheet] = useState<'overview' | 'submit' | 'exit' | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const submitted = useRef(false);
  const enteredAt = useRef(Date.now());

  const question = attempt.questions[index];

  const finish = useCallback(
    async (auto: boolean) => {
      // Twee keer inleveren kan bij de combinatie 'net op tijd tikken' en 'de
      // klok slaat toe'; de tweede aanroep zou de score overschrijven.
      if (submitted.current) return;
      submitted.current = true;
      setBusy(true);

      if (auto) void alarm();
      await submitAttempt(attempt.id, auto);
      navigate(`/result/${attempt.id}`, { replace: true });
    },
    [attempt.id, navigate],
  );

  useEffect(() => {
    if (attempt.timeLimitSeconds === null) return;
    const deadline = attempt.startedAt + attempt.timeLimitSeconds;

    const tick = () => {
      const left = deadline - Math.floor(Date.now() / 1000);
      setRemaining(left);
      if (left <= 0) void finish(true);
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [attempt.startedAt, attempt.timeLimitSeconds, finish]);

  // De tijd per vraag telt vanaf het moment dat hij in beeld komt.
  useEffect(() => {
    enteredAt.current = Date.now();
  }, [index]);

  const choose = async (optionId: string) => {
    if (!question || submitted.current) return;

    const previous = answers[question.position] ?? null;
    const spent = Date.now() - enteredAt.current;
    enteredAt.current = Date.now();

    setAnswers((current) => ({ ...current, [question.position]: optionId }));
    setNotice(null);

    const result = await saveAnswer({
      attemptId: attempt.id,
      position: question.position,
      optionId,
      timeSpentMs: spent,
    });

    if (!result.ok) {
      // Wat niet is opgeslagen mag niet als beantwoord ogen.
      setAnswers((current) => ({ ...current, [question.position]: previous }));
      setNotice(result.error ?? t('common.error'));
    }
  };

  const flag = async () => {
    if (!question) return;
    const result = await toggleFlag({ attemptId: attempt.id, position: question.position });
    if (result.ok) {
      setFlags((current) => ({ ...current, [question.position]: result.flagged === true }));
    }
  };

  const answered = Object.values(answers).filter((value) => value !== null).length;
  const unanswered = total - answered;
  const isLast = index >= total - 1;

  const timerTone =
    remaining === null
      ? 'neutral'
      : remaining <= DANGER_SECONDS
        ? 'danger'
        : remaining <= WARNING_SECONDS
          ? 'warning'
          : 'neutral';

  return (
    <div className="pt-1">
      <TopBar
        title={`${t('exam.question')} ${index + 1} ${t('exam.of')} ${total}`}
        subtitle={attempt.certificationTitle}
        onBack={() => setSheet('exit')}
        action={
          remaining === null ? (
            <Badge tone="neutral">{t('exam.noTimeLimit')}</Badge>
          ) : (
            <span
              className="rounded-lg px-2.5 py-1 text-sm font-semibold tabular-nums"
              style={{
                background:
                  timerTone === 'danger'
                    ? 'var(--danger-soft)'
                    : timerTone === 'warning'
                      ? 'var(--warning-soft)'
                      : 'var(--surface-hover)',
                color:
                  timerTone === 'danger'
                    ? 'var(--danger)'
                    : timerTone === 'warning'
                      ? 'var(--warning)'
                      : 'var(--text-muted)',
              }}
              role="timer"
              aria-label={t('exam.timeLeft')}
            >
              {formatClock(remaining)}
            </span>
          )
        }
      />

      <ProgressBar
        value={answered}
        max={Math.max(1, total)}
        height={4}
        label={t('exam.answered')}
      />

      {question ? (
        <>
          <div className="mt-5">
            <QuestionStem
              stem={question.stem}
              {...(question.listItems ? { listItems: question.listItems } : {})}
            />
          </div>

          <div className="mt-5 space-y-2.5">
            {question.options.map((option) => (
              <OptionButton
                key={option.id}
                label={option.label}
                text={option.text}
                selected={answers[question.position] === option.id}
                onClick={() => void choose(option.id)}
              />
            ))}
          </div>

          {notice ? (
            <div className="mt-4">
              <ErrorNote message={notice} />
            </div>
          ) : null}

          <button
            type="button"
            className="p115-btn p115-btn-ghost mt-4 w-full"
            onClick={() => void flag()}
            aria-pressed={flags[question.position] === true}
            style={
              flags[question.position]
                ? { color: 'var(--warning)', background: 'var(--warning-soft)' }
                : undefined
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 21V4h12l-2.5 4L18 12H6"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {flags[question.position] ? t('exam.flagged') : t('exam.flag')}
          </button>
        </>
      ) : (
        <ErrorNote message={t('common.error')} />
      )}

      <div className="p115-actionbar">
        <button
          type="button"
          className="p115-btn p115-btn-secondary flex-1"
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          disabled={index === 0}
        >
          {t('exam.previous')}
        </button>

        <button
          type="button"
          className="p115-btn p115-btn-secondary"
          onClick={() => setSheet('overview')}
          aria-label={t('exam.overview')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {isLast ? (
          <button
            type="button"
            className="p115-btn p115-btn-primary flex-1"
            onClick={() => setSheet('submit')}
            disabled={busy}
          >
            {t('exam.submit')}
          </button>
        ) : (
          <button
            type="button"
            className="p115-btn p115-btn-primary flex-1"
            onClick={() => setIndex((value) => Math.min(total - 1, value + 1))}
          >
            {t('exam.next')}
          </button>
        )}
      </div>

      <Sheet
        open={sheet === 'overview'}
        onClose={() => setSheet(null)}
        title={t('exam.overview')}
        actions={
          <>
            <button
              type="button"
              className="p115-btn p115-btn-secondary flex-1"
              onClick={() => setSheet(null)}
            >
              {t('common.close')}
            </button>
            <button
              type="button"
              className="p115-btn p115-btn-primary flex-1"
              onClick={() => setSheet('submit')}
            >
              {t('exam.submit')}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-muted)' }}>
          {answered} {t('exam.answered')} · {unanswered} {t('exam.unanswered')}
        </p>

        <div className="mt-4 grid grid-cols-6 gap-2">
          {attempt.questions.map((row, position) => (
            <button
              key={row.questionId}
              type="button"
              className="p115-nav-dot"
              data-answered={answers[row.position] !== null}
              data-flagged={flags[row.position] === true}
              data-current={position === index}
              onClick={() => {
                setIndex(position);
                setSheet(null);
              }}
              aria-label={`${t('exam.question')} ${position + 1}`}
            >
              {position + 1}
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet
        open={sheet === 'submit'}
        onClose={() => setSheet(null)}
        title={t('exam.submit')}
        actions={
          <>
            <button
              type="button"
              className="p115-btn p115-btn-secondary flex-1"
              onClick={() => setSheet(null)}
              disabled={busy}
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="p115-btn p115-btn-primary flex-1"
              onClick={() => void finish(false)}
              disabled={busy}
            >
              {t('exam.submit')}
            </button>
          </>
        }
      >
        <p>{t('exam.submitConfirm')}</p>
        {unanswered > 0 ? (
          <p className="mt-2 font-medium" style={{ color: 'var(--warning)' }}>
            {unanswered} {t('exam.unanswered')}
          </p>
        ) : null}
      </Sheet>

      <Sheet
        open={sheet === 'exit'}
        onClose={() => setSheet(null)}
        title={t('exam.exitWarning')}
        actions={
          <>
            <button
              type="button"
              className="p115-btn p115-btn-secondary flex-1"
              onClick={() => setSheet(null)}
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="p115-btn p115-btn-primary flex-1"
              onClick={() => navigate('/', { replace: true })}
            >
              {t('common.confirm')}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-muted)' }}>
          {t('exam.inProgress')} — {t('exam.resume')}.
        </p>
      </Sheet>
    </div>
  );
}
