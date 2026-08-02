import { useState } from 'react';

import { useApp } from '@/app/app-state';
import { Explanation, OptionButton, QuestionStem } from '@/components/question';
import {
  Badge,
  Card,
  ErrorNote,
  Loading,
  ProgressBar,
  ScoreRing,
  Stat,
  TopBar,
} from '@/components/ui';
import { loadAttempt, type LoadedAttempt, type LoadedQuestion } from '@/lib/exam';
import { formatDateTime, formatDuration } from '@/lib/format';
import { useRouter } from '@/lib/router';
import { PASS_RATIO } from '@/lib/stats';
import { useAsync } from '@/lib/use-async';

/**
 * Examenrapport.
 *
 * De score staat bovenaan, maar het rapport gaat over wat eronder staat: bij
 * welk examengebied je onder de cesuur zakt, en waarom een antwoord fout was.
 * Een cijfer zonder die twee dingen vertelt je alleen dat je iets niet weet,
 * niet wát.
 */

export function ResultScreen({ attemptId }: { attemptId: string }) {
  const { t } = useApp();
  const { navigate } = useRouter();
  const { data, error, loading, reload } = useAsync(
    () => loadAttempt(attemptId),
    [attemptId],
  );

  if (loading) return <Loading label={t('common.loading')} />;

  if (error || !data) {
    return (
      <div className="pt-5">
        <TopBar title={t('result.title')} onBack={() => navigate('/', { replace: true })} />
        <ErrorNote
          message={t('common.error')}
          onRetry={reload}
          retryLabel={t('common.confirm')}
        />
      </div>
    );
  }

  return <Report attempt={data} />;
}

interface DomainRow {
  code: string;
  title: string;
  answered: number;
  correct: number;
}

function byDomain(questions: LoadedQuestion[]): DomainRow[] {
  const rows = new Map<string, DomainRow>();

  for (const question of questions) {
    const row = rows.get(question.domainCode) ?? {
      code: question.domainCode,
      title: question.domainTitle,
      answered: 0,
      correct: 0,
    };
    row.answered += 1;
    if (question.isCorrect === true) row.correct += 1;
    rows.set(question.domainCode, row);
  }

  return [...rows.values()].sort((a, b) => a.code.localeCompare(b.code));
}

function Report({ attempt }: { attempt: LoadedAttempt }) {
  const { t, locale } = useApp();
  const { navigate } = useRouter();

  const [onlyWrong, setOnlyWrong] = useState(false);

  const score = attempt.score ?? 0;
  const total = attempt.questionCount;
  const passed = attempt.passed === true;
  const percentage = total > 0 ? (score / total) * 100 : 0;

  const duration =
    attempt.finishedAt !== null ? attempt.finishedAt - attempt.startedAt : null;

  const domains = byDomain(attempt.questions);
  const shown = onlyWrong
    ? attempt.questions.filter((question) => question.isCorrect !== true)
    : attempt.questions;

  return (
    <div className="pt-1">
      <TopBar
        title={t('result.title')}
        subtitle={attempt.certificationTitle}
        onBack={() => navigate('/', { replace: true })}
      />

      <Card className="mb-4 text-center">
        <div className="flex justify-center">
          <ScoreRing
            value={percentage}
            size={132}
            label={`${score}/${total}`}
            sublabel={`${Math.round(percentage)}%`}
            tone={passed ? 'success' : 'danger'}
          />
        </div>

        <div className="mt-3 flex justify-center">
          <Badge tone={passed ? 'success' : 'danger'}>
            {passed ? t('result.passed') : t('result.failed')}
          </Badge>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-left">
          <Stat label={t('result.passMark')} value={`${attempt.passMark}/${total}`} />
          <Stat
            label={t('result.timeUsed')}
            value={duration === null ? '—' : formatDuration(duration, locale)}
          />
          <Stat
            label={t('result.extraTime')}
            value={attempt.extraTimeApplied ? t('common.yes') : t('common.no')}
          />
        </div>

        <p className="mt-4 text-xs" style={{ color: 'var(--text-subtle)' }}>
          {formatDateTime(attempt.startedAt, locale)}
        </p>

        {attempt.autoSubmitted ? (
          <p className="mt-2 text-xs font-medium" style={{ color: 'var(--warning)' }}>
            {t('result.autoSubmitted')}
          </p>
        ) : null}
      </Card>

      <Card className="mb-4">
        <h2 className="text-sm font-semibold">{t('result.byDomain')}</h2>
        <div className="mt-4 space-y-4">
          {domains.map((domain) => {
            const ratio = domain.answered > 0 ? domain.correct / domain.answered : 0;
            return (
              <div key={domain.code}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <span className="min-w-0 flex-1 text-sm leading-snug">{domain.title}</span>
                  <span className="flex-shrink-0 text-sm font-medium tabular-nums">
                    {domain.correct}/{domain.answered}
                  </span>
                </div>
                <ProgressBar
                  value={domain.correct}
                  max={Math.max(1, domain.answered)}
                  threshold={domain.answered * PASS_RATIO}
                  tone={ratio >= PASS_RATIO ? 'success' : 'danger'}
                  height={7}
                  label={domain.title}
                />
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
          {t('result.passMark')}: {Math.round(PASS_RATIO * 100)}%
        </p>
      </Card>

      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-subtle)' }}>
          {t('result.review')}
        </h2>
        <button
          type="button"
          className="p115-btn p115-btn-ghost px-3 py-1.5 text-xs"
          onClick={() => setOnlyWrong((value) => !value)}
          aria-pressed={onlyWrong}
          style={
            onlyWrong ? { background: 'var(--danger-soft)', color: 'var(--danger)' } : undefined
          }
        >
          {t('result.incorrect')} ({total - score})
        </button>
      </div>

      <div className="space-y-3">
        {shown.map((question) => {
          const correctOption = question.options.find((option) => option.isCorrect);
          return (
            <Card key={question.questionId}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-medium" style={{ color: 'var(--text-subtle)' }}>
                  {question.position + 1}. {t('common.objective')} {question.objectiveCode}
                </span>
                <Badge
                  tone={
                    question.isCorrect === true
                      ? 'success'
                      : question.selectedOptionId === null
                        ? 'neutral'
                        : 'danger'
                  }
                >
                  {question.isCorrect === true
                    ? t('result.correct')
                    : question.selectedOptionId === null
                      ? t('result.notAnswered')
                      : t('result.incorrect')}
                </Badge>
              </div>

              <QuestionStem
                stem={question.stem}
                stemAlt={question.stemAlt}
                {...(question.listItems ? { listItems: question.listItems } : {})}
              />

              <div className="mt-4 space-y-2">
                {question.options.map((option) => (
                  <OptionButton
                    key={option.id}
                    label={option.label}
                    text={option.text}
                    disabled
                    selected={option.id === question.selectedOptionId}
                    state={
                      option.isCorrect
                        ? 'correct'
                        : option.id === question.selectedOptionId
                          ? 'incorrect'
                          : null
                    }
                    footnote={option.rationale}
                  />
                ))}
              </div>

              <div className="mt-4">
                <Explanation
                  title={t('result.explanation')}
                  sourceRef={question.sourceRef}
                  sourceLabel={t('common.source')}
                >
                  {question.explanation}
                  {question.selectedOptionId === null && correctOption ? (
                    <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
                      {t('result.correctAnswer')}: {correctOption.label}
                    </p>
                  ) : null}
                </Explanation>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="p115-actionbar">
        <button
          type="button"
          className="p115-btn p115-btn-secondary flex-1"
          onClick={() => navigate(`/stats/${attempt.certificationId}`, { replace: true })}
        >
          {t('nav.stats')}
        </button>
        <button
          type="button"
          className="p115-btn p115-btn-primary flex-1"
          onClick={() => navigate('/', { replace: true })}
        >
          {t('common.done')}
        </button>
      </div>
    </div>
  );
}
