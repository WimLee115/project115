import Link from 'next/link';
import type { Metadata } from 'next';
import { eq, and, isNull, desc } from 'drizzle-orm';

import { db } from '@/db';
import { certifications, studyPlans, attempts } from '@/db/schema';
import { requireUser } from '@/lib/auth/session';
import { getTranslator } from '@/lib/i18n';
import { getCertificationProgress, PASS_RATIO } from '@/lib/stats';
import { countDueCards } from '@/lib/srs';
import { Card, PageHeading, Badge, ProgressBar, ScoreRing, EmptyState } from '@/components/ui';

export const metadata: Metadata = { title: 'Dashboard' };

function daysUntil(timestamp: number): number {
  return Math.ceil((timestamp * 1000 - Date.now()) / 86_400_000);
}

function formatDate(timestamp: number, locale: string): string {
  return new Date(timestamp * 1000).toLocaleDateString(
    locale === 'nl' ? 'nl-NL' : 'en-GB',
    { day: 'numeric', month: 'short', year: 'numeric' },
  );
}

export default async function DashboardPage() {
  const session = await requireUser();
  if (!session) return null;

  const t = getTranslator(session.user.locale);
  const locale = session.user.locale;

  const certs = await db
    .select()
    .from(certifications)
    .orderBy(certifications.sortOrder);

  const plans = await db
    .select()
    .from(studyPlans)
    .where(eq(studyPlans.userId, session.user.id));

  const openAttempts = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.userId, session.user.id), isNull(attempts.finishedAt)))
    .orderBy(desc(attempts.startedAt));

  const progressList = await Promise.all(
    certs.map((cert) => getCertificationProgress(session.user.id, cert.id, locale)),
  );

  const totalDue = await countDueCards(session.user.id);

  return (
    <>
      <PageHeading
        title={`${t('dashboard.welcome')}, ${session.user.displayName}`}
        subtitle={t('app.tagline')}
      />

      {openAttempts.length > 0 ? (
        <Card className="mb-6" >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge tone="warning">{t('exam.inProgress')}</Badge>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                Je hebt {openAttempts.length === 1 ? 'een onafgeronde sessie' : `${openAttempts.length} onafgeronde sessies`}.
              </p>
            </div>
            <div className="flex gap-2">
              {openAttempts.slice(0, 2).map((attempt) => (
                <Link
                  key={attempt.id}
                  href={attempt.mode === 'exam' ? `/exam/${attempt.id}` : `/practice/${attempt.id}`}
                  className="p115-btn p115-btn-primary text-sm"
                >
                  {t('exam.resume')}
                </Link>
              ))}
            </div>
          </div>
        </Card>
      ) : null}

      {totalDue > 0 ? (
        <Card className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{t('dashboard.dueToday')}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {totalDue} {t('dashboard.cards')} staan klaar om te herhalen.
              </p>
            </div>
            <Link href="/review" className="p115-btn p115-btn-primary text-sm">
              {t('nav.review')}
            </Link>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        {certs.map((cert, index) => {
          const progress = progressList[index];
          const plan = plans.find((p) => p.certificationId === cert.id);
          const title = locale === 'nl' ? cert.titleNl : cert.titleEn;
          const days = plan?.examDate ? daysUntil(plan.examDate) : null;

          if (!progress) return null;

          const readinessTone =
            progress.readiness >= 75 ? 'success' : progress.readiness >= 50 ? 'warning' : 'danger';

          return (
            <Card key={cert.id}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ background: cert.accentColor }}
                    aria-hidden="true"
                  />
                  <div>
                    <h2 className="font-semibold leading-snug">{title}</h2>
                    <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                      {cert.provider} &middot; {cert.questionCount} vragen &middot;{' '}
                      {cert.durationMinutes} min &middot; cesuur {cert.passMark}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <ScoreRing
                  value={progress.readiness}
                  size={100}
                  sublabel={t('stats.readiness')}
                  tone={readinessTone}
                />

                <div className="flex-1 space-y-3 text-sm">
                  {days !== null ? (
                    <p>
                      <span className="text-2xl font-semibold tabular-nums">{days}</span>{' '}
                      <span style={{ color: 'var(--text-muted)' }}>
                        {t('dashboard.daysUntilExam')}
                      </span>
                    </p>
                  ) : (
                    <Link
                      href="/settings"
                      className="text-sm underline"
                      style={{ color: 'var(--accent)' }}
                    >
                      {t('dashboard.setExamDate')}
                    </Link>
                  )}

                  <dl className="space-y-1" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex justify-between gap-3">
                      <dt>{t('stats.attempts')}</dt>
                      <dd className="tabular-nums">{progress.examAttempts}</dd>
                    </div>
                    {progress.bestScore !== null ? (
                      <div className="flex justify-between gap-3">
                        <dt>{t('stats.bestScore')}</dt>
                        <dd className="tabular-nums">
                          {progress.bestScore}/{cert.questionCount}
                        </dd>
                      </div>
                    ) : null}
                    <div className="flex justify-between gap-3">
                      <dt>{t('stats.questionsSeen')}</dt>
                      <dd className="tabular-nums">
                        {progress.seenQuestions}/{progress.totalQuestions}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {progress.lastScore !== null ? (
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>{t('stats.lastAttempt')}</span>
                    <span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>
                      {progress.lastScore}/{cert.questionCount}
                    </span>
                  </div>
                  <ProgressBar
                    value={progress.lastScore}
                    max={cert.questionCount}
                    threshold={cert.passMark}
                    tone={progress.lastScore >= cert.passMark ? 'success' : 'danger'}
                    height={7}
                  />
                </div>
              ) : null}

              {progress.weakest.length > 0 ? (
                <div className="mt-4 border-t pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-subtle)' }}>
                    {t('stats.weakest')}
                  </p>
                  <ul className="space-y-1.5 text-sm">
                    {progress.weakest.slice(0, 3).map((objective) => (
                      <li key={objective.objectiveId} className="flex items-baseline justify-between gap-3">
                        <span className="truncate" title={objective.description}>
                          <span className="tabular-nums" style={{ color: 'var(--text-subtle)' }}>
                            {objective.code}
                          </span>{' '}
                          {objective.description}
                        </span>
                        <span
                          className="flex-shrink-0 tabular-nums text-xs font-semibold"
                          style={{
                            color:
                              objective.ratio >= PASS_RATIO ? 'var(--success)' : 'var(--danger)',
                          }}
                        >
                          {Math.round(objective.ratio * 100)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-4 flex gap-2 border-t pt-4">
                <Link href="/exam" className="p115-btn p115-btn-primary flex-1 text-sm">
                  {t('exam.startShort')}
                </Link>
                <Link href="/practice" className="p115-btn p115-btn-secondary flex-1 text-sm">
                  {t('nav.practice')}
                </Link>
                <Link href="/stats" className="p115-btn p115-btn-secondary text-sm">
                  {t('nav.stats')}
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">{t('dashboard.recentAttempts')}</h2>
        {progressList.every((p) => (p?.attempts.length ?? 0) === 0) ? (
          <EmptyState
            title={t('dashboard.noAttempts')}
            description={t('stats.noData')}
            action={
              <Link href="/exam" className="p115-btn p115-btn-primary text-sm">
                {t('dashboard.startStudying')}
              </Link>
            }
          />
        ) : (
          <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {progressList
              .flatMap((p, i) =>
                (p?.attempts ?? []).map((a) => ({ attempt: a, cert: certs[i] })),
              )
              .sort((a, b) => b.attempt.startedAt - a.attempt.startedAt)
              .slice(0, 8)
              .map(({ attempt, cert }) => (
                <li key={attempt.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <Link
                      href={`/result/${attempt.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {cert
                        ? locale === 'nl'
                          ? cert.titleNl
                          : cert.titleEn
                        : attempt.id}
                    </Link>
                    <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                      {formatDate(attempt.startedAt, locale)} &middot; {attempt.mode}
                    </p>
                  </div>
                  {attempt.score !== null ? (
                    <span className="flex-shrink-0">
                      <Badge tone={attempt.passed ? 'success' : 'danger'}>
                        {attempt.score}/{attempt.questionCount}
                      </Badge>
                    </span>
                  ) : null}
                </li>
              ))}
          </ul>
        )}
      </Card>
    </>
  );
}
