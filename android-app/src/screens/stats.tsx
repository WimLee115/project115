import { useState } from 'react';

import { useApp } from '@/app/app-state';
import {
  Badge,
  Card,
  EmptyState,
  ErrorNote,
  Loading,
  PageHeading,
  ProgressBar,
  Row,
  ScoreRing,
  Section,
  Stat,
  TopBar,
} from '@/components/ui';
import { startAttempt } from '@/lib/exam';
import { formatDate, formatPercent } from '@/lib/format';
import { useRouter } from '@/lib/router';
import {
  getAllProgress,
  PASS_RATIO,
  type CertificationProgress,
  type ObjectiveScore,
} from '@/lib/stats';
import { useAsync } from '@/lib/use-async';

/**
 * Voortgang.
 *
 * Zonder gekozen certificering een overzicht van allebei; met één gekozen het
 * volledige beeld. De volgorde van de blokken is niet toevallig: eerst hoe je
 * ervoor staat, dan waar het misgaat, en pas daarna wat al goed gaat. Dat
 * laatste is prettig om te zien maar verandert niets aan wat je vanavond moet
 * doen.
 */

function tone(ratio: number): 'success' | 'warning' | 'danger' {
  if (ratio >= PASS_RATIO) return 'success';
  if (ratio >= PASS_RATIO * 0.75) return 'warning';
  return 'danger';
}

export function StatsScreen({ certificationId }: { certificationId: string | null }) {
  const { t, locale } = useApp();
  const { navigate } = useRouter();

  const { data, error, loading, reload } = useAsync(
    () => getAllProgress(locale),
    [locale],
  );

  if (loading) return <Loading label={t('common.loading')} />;

  if (error || !data) {
    return (
      <div className="pt-5">
        <ErrorNote message={t('common.error')} onRetry={reload} retryLabel={t('common.confirm')} />
      </div>
    );
  }

  const selected = certificationId
    ? (data.find((row) => row.certificationId === certificationId) ?? null)
    : null;

  if (!selected) {
    return (
      <div className="pt-5">
        <PageHeading title={t('stats.title')} subtitle={t('exam.chooseCertification')} />

        <div className="space-y-3">
          {data.map((progress) => (
            <Card key={progress.certificationId}>
              <button
                type="button"
                className="flex w-full items-center gap-4 text-left"
                onClick={() => navigate(`/stats/${progress.certificationId}`)}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9375rem] font-semibold leading-snug">
                    {progress.title}
                  </span>
                  <span className="mt-1 block text-xs" style={{ color: 'var(--text-muted)' }}>
                    {progress.examAttempts} {t('stats.attempts').toLowerCase()} ·{' '}
                    {progress.seenQuestions}/{progress.totalQuestions} {t('stats.questionsSeen')}
                  </span>
                </span>
                <ScoreRing
                  value={progress.readiness}
                  size={72}
                  tone={progress.readiness >= 70 ? 'success' : progress.readiness >= 40 ? 'warning' : 'danger'}
                />
              </button>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return <Detail progress={selected} />;
}

function Detail({ progress }: { progress: CertificationProgress }) {
  const { t, locale } = useApp();
  const { navigate } = useRouter();
  const [busy, setBusy] = useState(false);

  const examAttempts = progress.attempts.filter((attempt) => attempt.mode === 'exam');

  /** Direct een korte oefensessie op één leerdoel; dat is de hele bedoeling
   *  van een zwakke-plekkenlijst die je alleen maar kunt lezen. */
  const practise = async (objectiveId: string) => {
    setBusy(true);
    try {
      const { attemptId } = await startAttempt({
        certificationId: progress.certificationId,
        mode: 'weakspot',
        locale,
        count: 10,
        objectiveIds: [objectiveId],
      });
      navigate(`/practice/${attemptId}`);
    } finally {
      setBusy(false);
    }
  };

  const untouched = progress.objectiveScores.filter((row) => row.answered === 0).length;

  return (
    <div className="pt-1">
      <TopBar
        title={t('stats.title')}
        subtitle={progress.title}
        onBack={() => navigate('/stats', { replace: true })}
      />

      <Card className="mb-4">
        <div className="flex items-center gap-5">
          <ScoreRing
            value={progress.readiness}
            size={110}
            tone={progress.readiness >= 70 ? 'success' : progress.readiness >= 40 ? 'warning' : 'danger'}
            sublabel={t('stats.readiness')}
          />
          <div className="min-w-0 flex-1 space-y-3">
            <Stat
              label={t('stats.attempts')}
              value={String(progress.examAttempts)}
            />
            <Stat
              label={t('stats.lastAttempt')}
              value={
                progress.lastScore === null
                  ? '—'
                  : `${progress.lastScore}/${progress.questionCount}`
              }
              {...(examAttempts[0]
                ? { hint: formatDate(examAttempts[0].startedAt, locale) }
                : {})}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <Stat
            label={t('stats.avgScore')}
            value={
              progress.averageScore === null
                ? '—'
                : `${progress.averageScore.toFixed(1)}/${progress.questionCount}`
            }
          />
          <Stat
            label={t('stats.bestScore')}
            value={
              progress.bestScore === null
                ? '—'
                : `${progress.bestScore}/${progress.questionCount}`
            }
            {...(progress.bestScore !== null && progress.bestScore >= progress.passMark
              ? { tone: 'success' as const }
              : {})}
          />
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-subtle)' }}>
              {t('stats.coverage')}
            </span>
            <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
              {progress.seenQuestions}/{progress.totalQuestions}
            </span>
          </div>
          <ProgressBar
            value={progress.seenQuestions}
            max={Math.max(1, progress.totalQuestions)}
            tone="info"
            height={7}
            label={t('stats.coverage')}
          />
        </div>
      </Card>

      {examAttempts.length > 1 ? (
        <Card className="mb-4">
          <h2 className="text-sm font-semibold">{t('stats.trend')}</h2>
          <Trend
            attempts={examAttempts
              .slice()
              .reverse()
              .map((attempt) => ({
                score: attempt.score ?? 0,
                total: attempt.questionCount,
                passMark: attempt.passMark,
              }))}
          />
          <p className="mt-3 text-xs" style={{ color: 'var(--text-subtle)' }}>
            {t('result.passMark')}: {progress.passMark}/{progress.questionCount}
          </p>
        </Card>
      ) : null}

      <Card className="mb-4">
        <h2 className="text-sm font-semibold">{t('result.byDomain')}</h2>
        <div className="mt-4 space-y-4">
          {progress.domainScores.map((domain) => (
            <div key={domain.code}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="min-w-0 flex-1 text-sm leading-snug">{domain.title}</span>
                <span className="flex-shrink-0 text-xs" style={{ color: 'var(--text-subtle)' }}>
                  {t('common.weight')} {Math.round(domain.weight * 100)}%
                </span>
              </div>
              <ProgressBar
                value={domain.correct}
                max={Math.max(1, domain.answered)}
                threshold={domain.answered * PASS_RATIO}
                tone={domain.answered === 0 ? 'neutral' : tone(domain.ratio)}
                height={7}
                label={domain.title}
              />
              <p className="mt-1 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                {domain.answered === 0
                  ? t('stats.noData')
                  : `${domain.correct}/${domain.answered} · ${formatPercent(domain.ratio)}`}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Section
        title={t('stats.weakest')}
        {...(untouched > 0
          ? {
              description: `${untouched} × ${t('common.objective').toLowerCase()} ${t('stats.objectivesUntouched')}`,
            }
          : {})}
      >
        {progress.weakest.length === 0 ? (
          <div className="px-4 py-6">
            <EmptyState title={t('stats.noData')} />
          </div>
        ) : (
          progress.weakest.map((objective) => (
            <ObjectiveRow
              key={objective.objectiveId}
              objective={objective}
              actionLabel={t('stats.practiceThis')}
              disabled={busy}
              onPractise={() => void practise(objective.objectiveId)}
            />
          ))
        )}
      </Section>

      {progress.strongest.length > 0 ? (
        <Section title={t('stats.strongest')}>
          {progress.strongest.map((objective) => (
            <Row
              key={objective.objectiveId}
              label={`${objective.code} — ${objective.topic}`}
              hint={`${objective.correct}/${objective.answered} · ${formatPercent(objective.ratio)}`}
              trailing={<Badge tone="success">{formatPercent(objective.ratio)}</Badge>}
            />
          ))}
        </Section>
      ) : null}
    </div>
  );
}

function ObjectiveRow({
  objective,
  actionLabel,
  disabled,
  onPractise,
}: {
  objective: ObjectiveScore;
  actionLabel: string;
  disabled: boolean;
  onPractise: () => void;
}) {
  return (
    <div className="border-b px-4 py-3.5 last:border-b-0" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[0.9375rem] font-medium leading-snug">
            {objective.code} — {objective.topic}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {objective.description}
          </p>
        </div>
        <Badge tone={objective.confident ? 'danger' : 'warning'}>
          {objective.correct}/{objective.answered}
        </Badge>
      </div>

      <div className="mt-2.5">
        <ProgressBar
          value={objective.correct}
          max={Math.max(1, objective.answered)}
          threshold={objective.answered * PASS_RATIO}
          tone={tone(objective.ratio)}
          height={6}
          label={objective.topic}
        />
      </div>

      <button
        type="button"
        className="p115-btn p115-btn-secondary mt-3 w-full text-sm"
        onClick={onPractise}
        disabled={disabled}
      >
        {actionLabel}
      </button>
    </div>
  );
}

/**
 * Scoreverloop als staafjes.
 *
 * Geen grafiekbibliotheek voor acht getallen. De cesuurlijn ligt eroverheen,
 * want de vraag is niet of je vooruitgaat maar of je boven de streep komt.
 */
function Trend({
  attempts,
}: {
  attempts: Array<{ score: number; total: number; passMark: number }>;
}) {
  const height = 88;

  return (
    <div className="relative mt-4" style={{ height }}>
      {attempts.map((attempt, index) => {
        const ratio = attempt.total > 0 ? attempt.score / attempt.total : 0;
        const passed = attempt.score >= attempt.passMark;
        const width = 100 / attempts.length;

        return (
          <div
            key={index}
            className="absolute bottom-0 flex flex-col items-center justify-end"
            style={{ left: `${index * width}%`, width: `${width}%`, height }}
          >
            <span className="mb-1 text-[0.625rem] tabular-nums" style={{ color: 'var(--text-subtle)' }}>
              {attempt.score}
            </span>
            <div
              className="w-[60%] rounded-t"
              style={{
                height: `${Math.max(2, ratio * (height - 18))}px`,
                background: passed ? 'var(--success)' : 'var(--danger)',
              }}
            />
          </div>
        );
      })}

      {attempts[0] ? (
        <div
          className="pointer-events-none absolute inset-x-0"
          style={{
            bottom: `${(attempts[0].passMark / Math.max(1, attempts[0].total)) * (height - 18)}px`,
            borderTop: '1px dashed var(--text-subtle)',
          }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
