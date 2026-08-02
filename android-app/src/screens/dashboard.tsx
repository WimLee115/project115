import { useApp } from '@/app/app-state';
import { Badge, Card, EmptyState, ErrorNote, Loading, PageHeading, ProgressBar, ScoreRing } from '@/components/ui';
import { getCertification, pick } from '@/lib/content';
import { getOpenAttempts } from '@/lib/exam';
import { daysUntil, formatDateTime } from '@/lib/format';
import { useRouter } from '@/lib/router';
import { countReviewsToday } from '@/lib/srs';
import { getAllProgress, type CertificationProgress } from '@/lib/stats';
import { allPlans, setMeta, type AttemptRow, type StudyPlanRow } from '@/lib/store';
import { useAsync } from '@/lib/use-async';

/**
 * Beginscherm.
 *
 * Beantwoordt in één blik drie vragen: is er iets blijven liggen, wat moet er
 * vandaag gebeuren, en hoe sta ik ervoor per examen. Alles wat daar niet aan
 * bijdraagt staat een schermdiepte verder — een dashboard dat alles toont,
 * toont niets.
 */

function readinessTone(value: number): 'success' | 'warning' | 'danger' {
  if (value >= 70) return 'success';
  if (value >= 40) return 'warning';
  return 'danger';
}

interface DashboardData {
  progress: CertificationProgress[];
  open: AttemptRow[];
  plans: StudyPlanRow[];
  reviewedToday: number;
}

export function DashboardScreen() {
  const { t, locale, settings, dueCount } = useApp();
  const { navigate } = useRouter();

  const { data, error, loading, reload } = useAsync<DashboardData>(async () => {
    const [progress, open, plans, reviewedToday] = await Promise.all([
      getAllProgress(locale),
      getOpenAttempts(),
      allPlans(),
      countReviewsToday(),
    ]);
    return { progress, open, plans, reviewedToday };
  }, [locale]);

  /** Onthoudt de keuze, zodat het instelscherm hem al ingevuld heeft staan. */
  const goTo = (path: string, certificationId: string) => {
    void setMeta('lastCertification', certificationId);
    navigate(path);
  };

  if (loading) return <Loading label={t('common.loading')} />;
  if (error || !data) {
    return (
      <div className="pt-5">
        <ErrorNote message={t('common.error')} onRetry={reload} retryLabel={t('common.confirm')} />
      </div>
    );
  }

  const firstName = settings.displayName.trim().split(/\s+/)[0] ?? '';

  return (
    <div className="pt-5">
      <PageHeading
        title={firstName ? `${t('dashboard.welcome')}, ${firstName}` : t('app.name')}
        subtitle={t('app.tagline')}
        actions={
          <button
            type="button"
            className="p115-icon-btn -mr-2"
            onClick={() => navigate('/settings')}
            aria-label={t('nav.settings')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
              <path
                d="M12 3.5v2m0 13v2M3.5 12h2m13 0h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        }
      />

      {/* Openstaande sessies eerst: dit is het enige blok met een verlies erin. */}
      {data.open.length > 0 ? (
        <div className="mb-4 space-y-3">
          {data.open.map((attempt) => {
            const certification = getCertification(attempt.certificationId);
            return (
              <Card key={attempt.id} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <Badge tone="warning">{t('exam.inProgress')}</Badge>
                  <p className="mt-1.5 truncate text-sm font-medium">
                    {certification
                      ? pick(locale, certification.titleNl, certification.titleEn)
                      : attempt.certificationId}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {formatDateTime(attempt.startedAt, locale)} · {attempt.questionCount}{' '}
                    {t('common.questions')}
                  </p>
                </div>
                <button
                  type="button"
                  className="p115-btn p115-btn-primary flex-shrink-0"
                  onClick={() =>
                    navigate(
                      `${attempt.mode === 'exam' ? '/exam' : '/practice'}/${attempt.id}`,
                    )
                  }
                >
                  {t('exam.resume')}
                </button>
              </Card>
            );
          })}
        </div>
      ) : null}

      <Card className="mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-subtle)' }}>
              {t('dashboard.dueToday')}
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {dueCount}{' '}
              <span className="text-base font-normal" style={{ color: 'var(--text-muted)' }}>
                {t('dashboard.cards')}
              </span>
            </p>
            <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              {data.reviewedToday} {t('review.reviewedToday')}
            </p>
          </div>
          <button
            type="button"
            className={`p115-btn flex-shrink-0 ${dueCount > 0 ? 'p115-btn-primary' : 'p115-btn-secondary'}`}
            onClick={() => navigate('/review')}
          >
            {t('review.title')}
          </button>
        </div>
      </Card>

      <section className="mb-4 space-y-3">
        {data.progress.map((progress) => {
          const plan = data.plans.find((row) => row.certificationId === progress.certificationId);
          const days = plan?.examDate != null ? daysUntil(plan.examDate) : null;

          return (
            <Card key={progress.certificationId}>
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-[0.9375rem] font-semibold leading-snug">{progress.title}</h2>

                  {days === null ? (
                    <button
                      type="button"
                      className="mt-1 text-xs underline underline-offset-2"
                      style={{ color: 'var(--text-muted)' }}
                      onClick={() => navigate('/settings')}
                    >
                      {t('dashboard.setExamDate')}
                    </button>
                  ) : (
                    <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {days > 1
                        ? `${days} ${t('dashboard.daysUntilExam')}`
                        : days === 1
                          ? t('dashboard.examTomorrow')
                          : days === 0
                            ? t('dashboard.examToday')
                            : t('dashboard.examPast')}
                    </p>
                  )}

                  <p className="mt-3 text-xs" style={{ color: 'var(--text-subtle)' }}>
                    {progress.seenQuestions}/{progress.totalQuestions} {t('stats.questionsSeen')}
                  </p>
                  <div className="mt-1.5">
                    <ProgressBar
                      value={progress.seenQuestions}
                      max={Math.max(1, progress.totalQuestions)}
                      tone="info"
                      height={6}
                      label={t('stats.coverage')}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/stats/${progress.certificationId}`)}
                  aria-label={`${t('stats.readiness')} — ${progress.title}`}
                  className="flex-shrink-0"
                >
                  <ScoreRing
                    value={progress.readiness}
                    size={86}
                    tone={readinessTone(progress.readiness)}
                    sublabel={t('stats.readiness')}
                  />
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="p115-btn p115-btn-primary flex-1"
                  onClick={() => goTo('/exam', progress.certificationId)}
                >
                  {t('nav.exam')}
                </button>
                <button
                  type="button"
                  className="p115-btn p115-btn-secondary flex-1"
                  onClick={() => goTo('/practice', progress.certificationId)}
                >
                  {t('nav.practice')}
                </button>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="mb-4">
        <h2
          className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide"
          style={{ color: 'var(--text-subtle)' }}
        >
          {t('dashboard.recentAttempts')}
        </h2>

        {data.progress.every((progress) => progress.attempts.length === 0) ? (
          <EmptyState title={t('dashboard.noAttempts')} description={t('stats.noData')} />
        ) : (
          <div className="p115-card overflow-hidden">
            {data.progress
              .flatMap((progress) =>
                progress.attempts.map((attempt) => ({ attempt, title: progress.title })),
              )
              .sort((a, b) => b.attempt.startedAt - a.attempt.startedAt)
              .slice(0, 6)
              .map(({ attempt, title }) => (
                <button
                  key={attempt.id}
                  type="button"
                  className="flex w-full items-center gap-3 border-b px-4 py-3 text-left last:border-b-0"
                  style={{ borderColor: 'var(--border)' }}
                  onClick={() => navigate(`/result/${attempt.id}`)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{title}</span>
                    <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>
                      {formatDateTime(attempt.startedAt, locale)} ·{' '}
                      {attempt.mode === 'exam' ? t('nav.exam') : t('nav.practice')}
                    </span>
                  </span>
                  <Badge tone={attempt.passed ? 'success' : 'danger'}>
                    {attempt.score ?? 0}/{attempt.questionCount}
                  </Badge>
                </button>
              ))}
          </div>
        )}
      </section>

      <p className="px-1 pb-2 text-center text-xs" style={{ color: 'var(--text-subtle)' }}>
        {t('app.author')} · {t('common.offline')}
      </p>
    </div>
  );
}
