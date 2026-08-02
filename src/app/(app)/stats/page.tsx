import type { Metadata } from 'next';

import { db } from '@/db';
import { certifications } from '@/db/schema';
import { requireUser } from '@/lib/auth/session';
import { getTranslator } from '@/lib/i18n';
import { getCertificationProgress, PASS_RATIO, type ObjectiveScore } from '@/lib/stats';
import { startAttempt } from '@/app/actions/exam';
import { Card, PageHeading, ProgressBar, ScoreRing, Stat, EmptyState, Badge } from '@/components/ui';

export const metadata: Metadata = { title: 'Voortgang' };

/**
 * Scoreverloop als sparkline.
 *
 * Bewust een eigen SVG en geen grafiekbibliotheek: het gaat om één reeks van
 * hooguit een paar dozijn punten, en de cesuurlijn is hier het belangrijkste
 * element — die wil je op een vaste plek, niet waar een library hem zet.
 */
function ScoreTrend({
  scores,
  max,
  passMark,
  label,
}: {
  scores: number[];
  max: number;
  passMark: number;
  label: string;
}) {
  if (scores.length < 2) return null;

  const width = 100;
  const height = 32;
  const step = width / (scores.length - 1);

  const toY = (score: number) => height - (score / max) * height;

  const path = scores
    .map((score, index) => `${index === 0 ? 'M' : 'L'} ${index * step} ${toY(score)}`)
    .join(' ');

  const passY = toY(passMark);
  const lastScore = scores[scores.length - 1] ?? 0;

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-subtle)' }}>
        {label}
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-16 w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label={`${label}: ${scores.join(', ')}`}
      >
        <line
          x1="0"
          y1={passY}
          x2={width}
          y2={passY}
          stroke="var(--text-subtle)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <path
          d={path}
          fill="none"
          stroke={lastScore >= passMark ? 'var(--success)' : 'var(--danger)'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {scores.map((score, index) => (
          <circle
            key={index}
            cx={index * step}
            cy={toY(score)}
            r="1.5"
            fill={score >= passMark ? 'var(--success)' : 'var(--danger)'}
          />
        ))}
      </svg>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-subtle)' }}>
        Stippellijn = cesuur ({passMark}). Oudste links, nieuwste rechts.
      </p>
    </div>
  );
}

function ObjectiveRow({ objective }: { objective: ObjectiveScore }) {
  const percentage = Math.round(objective.ratio * 100);
  const tone =
    objective.answered === 0
      ? 'neutral'
      : objective.ratio >= PASS_RATIO
        ? 'success'
        : objective.ratio >= 0.5
          ? 'warning'
          : 'danger';

  return (
    <li className="py-2.5">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm">
          <span className="tabular-nums font-medium" style={{ color: 'var(--text-subtle)' }}>
            {objective.code}
          </span>{' '}
          {objective.description}
        </span>
        <span className="flex flex-shrink-0 items-center gap-2 text-xs tabular-nums">
          {objective.answered === 0 ? (
            <span style={{ color: 'var(--text-subtle)' }}>&mdash;</span>
          ) : (
            <>
              <span style={{ color: 'var(--text-muted)' }}>
                {objective.correct}/{objective.answered}
              </span>
              <span className="font-semibold" style={{ minWidth: '2.5rem', textAlign: 'right' }}>
                {percentage}%
              </span>
            </>
          )}
        </span>
      </div>
      <ProgressBar
        value={objective.answered === 0 ? 0 : objective.correct}
        max={Math.max(objective.answered, 1)}
        tone={tone}
        threshold={objective.answered * PASS_RATIO}
        height={4}
      />
      {!objective.confident && objective.answered > 0 ? (
        <p className="mt-1 text-xs" style={{ color: 'var(--text-subtle)' }}>
          Nog weinig data ({objective.answered} {objective.answered === 1 ? 'antwoord' : 'antwoorden'}).
        </p>
      ) : null}
    </li>
  );
}

export default async function StatsPage() {
  const session = await requireUser();
  if (!session) return null;

  const t = getTranslator(session.user.locale);
  const locale = session.user.locale;

  const certs = await db
    .select()
    .from(certifications)
    .orderBy(certifications.sortOrder);

  const progressList = await Promise.all(
    certs.map((cert) => getCertificationProgress(session.user.id, cert.id, locale)),
  );

  const hasAnyData = progressList.some((p) => (p?.seenQuestions ?? 0) > 0);

  if (!hasAnyData) {
    return (
      <>
        <PageHeading title={t('stats.title')} />
        <EmptyState title={t('stats.noData')} />
      </>
    );
  }

  return (
    <>
      <PageHeading title={t('stats.title')} />

      <div className="space-y-8">
        {progressList.map((progress, index) => {
          const cert = certs[index];
          if (!progress || !cert) return null;

          const examScores = progress.attempts
            .filter((a) => a.mode === 'exam' && a.score !== null)
            .map((a) => a.score ?? 0)
            .reverse();

          const readinessTone =
            progress.readiness >= 75 ? 'success' : progress.readiness >= 50 ? 'warning' : 'danger';

          // Leerdoelen gegroepeerd per examengebied, zodat de weging zichtbaar blijft.
          const byDomain = progress.domainScores.map((domain) => ({
            domain,
            objectives: progress.objectiveScores.filter((o) => o.domainCode === domain.code),
          }));

          return (
            <section key={cert.id}>
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: cert.accentColor }}
                  aria-hidden="true"
                />
                <h2 className="text-lg font-semibold">{progress.title}</h2>
              </div>

              <Card className="mb-4">
                <div className="flex flex-wrap items-center gap-8">
                  <ScoreRing
                    value={progress.readiness}
                    sublabel={t('stats.readiness')}
                    tone={readinessTone}
                  />
                  <div className="grid flex-1 grid-cols-2 gap-6 sm:grid-cols-4">
                    <Stat label={t('stats.attempts')} value={String(progress.examAttempts)} />
                    <Stat
                      label={t('stats.avgScore')}
                      value={
                        progress.averageScore !== null
                          ? `${progress.averageScore.toFixed(1)}/${cert.questionCount}`
                          : '—'
                      }
                    />
                    <Stat
                      label={t('stats.bestScore')}
                      value={
                        progress.bestScore !== null
                          ? `${progress.bestScore}/${cert.questionCount}`
                          : '—'
                      }
                      tone={
                        progress.bestScore !== null && progress.bestScore >= cert.passMark
                          ? 'success'
                          : undefined
                      }
                    />
                    <Stat
                      label={t('stats.questionsSeen')}
                      value={`${progress.seenQuestions}/${progress.totalQuestions}`}
                    />
                  </div>
                </div>

                {examScores.length >= 2 ? (
                  <div className="mt-6 border-t pt-5">
                    <ScoreTrend
                      scores={examScores}
                      max={cert.questionCount}
                      passMark={cert.passMark}
                      label={t('stats.trend')}
                    />
                  </div>
                ) : null}
              </Card>

              {progress.weakest.length > 0 ? (
                <Card className="mb-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold">{t('stats.weakest')}</h3>
                    <form action={startAttempt}>
                      <input type="hidden" name="certificationId" value={cert.id} />
                      <input type="hidden" name="mode" value="weakspot" />
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="count" value="15" />
                      <button type="submit" className="p115-btn p115-btn-primary px-3 py-1.5 text-sm">
                        {t('stats.practiceThis')}
                      </button>
                    </form>
                  </div>
                  <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {progress.weakest.map((objective) => (
                      <ObjectiveRow key={objective.objectiveId} objective={objective} />
                    ))}
                  </ul>
                </Card>
              ) : null}

              <Card>
                <h3 className="mb-4 text-sm font-semibold">{t('stats.byObjective')}</h3>
                <div className="space-y-6">
                  {byDomain.map(({ domain, objectives }) => (
                    <div key={domain.code}>
                      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="text-sm font-medium">
                          <span className="tabular-nums" style={{ color: 'var(--text-subtle)' }}>
                            {domain.code}.
                          </span>{' '}
                          {domain.title}
                        </h4>
                        <span className="flex items-center gap-2 text-xs">
                          <Badge tone="neutral">
                            {t('common.weight')} {domain.weight}%
                          </Badge>
                          {domain.answered > 0 ? (
                            <span
                              className="font-semibold tabular-nums"
                              style={{
                                color:
                                  domain.ratio >= PASS_RATIO ? 'var(--success)' : 'var(--danger)',
                              }}
                            >
                              {Math.round(domain.ratio * 100)}%
                            </span>
                          ) : null}
                        </span>
                      </div>
                      <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
                        {objectives.map((objective) => (
                          <ObjectiveRow key={objective.objectiveId} objective={objective} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          );
        })}
      </div>
    </>
  );
}
