import Link from 'next/link';
import type { Metadata } from 'next';
import { eq, and, isNull, desc } from 'drizzle-orm';

import { db } from '@/db';
import { certifications, attempts, studyPlans, questions } from '@/db/schema';
import { requireUser } from '@/lib/auth/session';
import { getTranslator } from '@/lib/i18n';
import { startAttempt } from '@/app/actions/exam';
import { Card, PageHeading, Badge } from '@/components/ui';
import { sql } from 'drizzle-orm';

export const metadata: Metadata = { title: 'Proefexamen' };

/** Keuzescherm: welke certificering, en onder welke condities. */
export default async function ExamPage() {
  const session = await requireUser();
  if (!session) return null;

  const t = getTranslator(session.user.locale);

  const certs = await db
    .select()
    .from(certifications)
    .orderBy(certifications.sortOrder);

  const openAttempts = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.userId, session.user.id), isNull(attempts.finishedAt)))
    .orderBy(desc(attempts.startedAt));

  const plans = await db
    .select()
    .from(studyPlans)
    .where(eq(studyPlans.userId, session.user.id));

  const counts = await db
    .select({
      certificationId: questions.certificationId,
      total: sql<number>`count(*)`,
    })
    .from(questions)
    .where(eq(questions.active, true))
    .groupBy(questions.certificationId);

  const countMap = new Map(counts.map((c) => [c.certificationId, Number(c.total)]));

  return (
    <>
      <PageHeading
        title={t('nav.exam')}
        subtitle={t('exam.noFeedback')}
      />

      <div className="grid gap-5 md:grid-cols-2">
        {certs.map((cert) => {
          const open = openAttempts.find(
            (a) => a.certificationId === cert.id && a.mode === 'exam',
          );
          const plan = plans.find((p) => p.certificationId === cert.id);
          const bankSize = countMap.get(cert.id) ?? 0;
          const title = session.user.locale === 'nl' ? cert.titleNl : cert.titleEn;
          const description =
            session.user.locale === 'nl' ? cert.descriptionNl : cert.descriptionEn;

          return (
            <Card key={cert.id}>
              <div className="mb-3 flex items-start gap-3">
                <span
                  className="mt-1 h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ background: cert.accentColor }}
                  aria-hidden="true"
                />
                <div>
                  <h2 className="font-semibold leading-snug">{title}</h2>
                  <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                    {cert.provider}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {description}
              </p>

              <dl className="mt-4 grid grid-cols-3 gap-3 border-t pt-4 text-center">
                <div>
                  <dt className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                    {t('common.questions')}
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums">{cert.questionCount}</dd>
                </div>
                <div>
                  <dt className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                    {t('common.minutes')}
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums">{cert.durationMinutes}</dd>
                </div>
                <div>
                  <dt className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                    {t('result.passMark')}
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums">{cert.passMark}</dd>
                </div>
              </dl>

              {open ? (
                <div className="mt-4">
                  <div className="mb-3">
                    <Badge tone="warning">{t('exam.inProgress')}</Badge>
                  </div>
                  <Link href={`/exam/${open.id}`} className="p115-btn p115-btn-primary w-full">
                    {t('exam.resume')}
                  </Link>
                </div>
              ) : (
                <form action={startAttempt} className="mt-4 space-y-3">
                  <input type="hidden" name="certificationId" value={cert.id} />
                  <input type="hidden" name="mode" value="exam" />
                  <input
                    type="hidden"
                    name="locale"
                    value={plan?.preferredLocale ?? session.user.locale}
                  />

                  {cert.extraTimeMinutes > 0 ? (
                    <label className="flex items-start gap-2.5 text-sm">
                      <input
                        type="checkbox"
                        name="extraTime"
                        defaultChecked={plan?.useExtraTime ?? false}
                        className="mt-0.5"
                      />
                      <span style={{ color: 'var(--text-muted)' }}>
                        {t('exam.extraTime')} &mdash; {cert.durationMinutes + cert.extraTimeMinutes}{' '}
                        {t('common.minutes')}
                      </span>
                    </label>
                  ) : null}

                  <button
                    type="submit"
                    className="p115-btn p115-btn-primary w-full"
                    disabled={bankSize === 0}
                  >
                    {t('exam.start')}
                  </button>

                  <p className="text-center text-xs" style={{ color: 'var(--text-subtle)' }}>
                    {bankSize} {t('common.questions')} in de bank
                  </p>
                </form>
              )}
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <h2 className="mb-2 text-sm font-semibold">{t('exam.conditions')}</h2>
        <ul className="space-y-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
          <li>
            Gesloten boek: geen naslagwerk, geen notities, geen hulpmiddelen.
          </li>
          <li>
            De verdeling over de examengebieden komt overeen met de officiële
            weging, zodat je oefening representatief is.
          </li>
          <li>{t('exam.noFeedback')}</li>
          <li>
            De timer loopt door op de server. Een tabblad sluiten of de pagina
            herladen levert geen extra tijd op.
          </li>
          <li>
            Sneltoetsen: <kbd>A</kbd>&ndash;<kbd>D</kbd> antwoorden,{' '}
            <kbd>&larr;</kbd> <kbd>&rarr;</kbd> navigeren, <kbd>F</kbd> markeren.
          </li>
        </ul>
      </Card>
    </>
  );
}
