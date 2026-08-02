import Link from 'next/link';
import type { Metadata } from 'next';
import { eq, and, isNull, desc } from 'drizzle-orm';

import { db } from '@/db';
import { certifications, attempts } from '@/db/schema';
import { requireUser } from '@/lib/auth/session';
import { getTranslator } from '@/lib/i18n';
import { startAttempt } from '@/app/actions/exam';
import { getCertificationProgress } from '@/lib/stats';
import { Card, PageHeading, Badge, ProgressBar } from '@/components/ui';

export const metadata: Metadata = { title: 'Oefenen' };

export default async function PracticePage() {
  const session = await requireUser();
  if (!session) return null;

  const t = getTranslator(session.user.locale);
  const locale = session.user.locale;

  const certs = await db
    .select()
    .from(certifications)
    .orderBy(certifications.sortOrder);

  const openAttempts = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.userId, session.user.id), isNull(attempts.finishedAt)))
    .orderBy(desc(attempts.startedAt));

  const progressList = await Promise.all(
    certs.map((cert) => getCertificationProgress(session.user.id, cert.id, locale)),
  );

  return (
    <>
      <PageHeading title={t('practice.title')} subtitle={t('practice.subtitle')} />

      <div className="grid gap-5 md:grid-cols-2">
        {certs.map((cert, index) => {
          const progress = progressList[index];
          const open = openAttempts.find(
            (a) => a.certificationId === cert.id && a.mode !== 'exam',
          );
          const title = locale === 'nl' ? cert.titleNl : cert.titleEn;
          const weakCount = progress?.weakest.length ?? 0;

          return (
            <Card key={cert.id}>
              <div className="mb-4 flex items-start gap-3">
                <span
                  className="mt-1 h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ background: cert.accentColor }}
                  aria-hidden="true"
                />
                <h2 className="font-semibold leading-snug">{title}</h2>
              </div>

              {progress && progress.seenQuestions > 0 ? (
                <div className="mb-4">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>Dekking van de vragenbank</span>
                    <span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>
                      {progress.seenQuestions}/{progress.totalQuestions}
                    </span>
                  </div>
                  <ProgressBar
                    value={progress.seenQuestions}
                    max={progress.totalQuestions}
                    tone="accent"
                    height={6}
                  />
                </div>
              ) : null}

              {open ? (
                <Link
                  href={`/practice/${open.id}`}
                  className="p115-btn p115-btn-primary mb-2 w-full"
                >
                  Sessie hervatten
                </Link>
              ) : null}

              <div className="space-y-2">
                <form action={startAttempt}>
                  <input type="hidden" name="certificationId" value={cert.id} />
                  <input type="hidden" name="mode" value="practice" />
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="count" value="20" />
                  <button
                    type="submit"
                    className="p115-btn p115-btn-secondary w-full"
                    disabled={open !== undefined}
                  >
                    20 vragen oefenen
                  </button>
                </form>

                <form action={startAttempt}>
                  <input type="hidden" name="certificationId" value={cert.id} />
                  <input type="hidden" name="mode" value="weakspot" />
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="count" value="15" />
                  <button
                    type="submit"
                    className="p115-btn p115-btn-secondary w-full"
                    disabled={open !== undefined}
                  >
                    {t('practice.weakSpots')}
                    {weakCount > 0 ? (
                      <span className="ml-1">
                        <Badge tone="warning">{weakCount}</Badge>
                      </span>
                    ) : null}
                  </button>
                </form>
              </div>

              <p className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                {t('practice.weakSpotsDesc')}
              </p>
            </Card>
          );
        })}
      </div>
    </>
  );
}
