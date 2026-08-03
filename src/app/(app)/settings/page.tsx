import type { Metadata } from 'next';
import { eq, desc } from 'drizzle-orm';

import { db } from '@/db';
import { certifications, studyPlans, sessions, auditLog } from '@/db/schema';
import { requireUser } from '@/lib/auth/session';
import { getTranslator } from '@/lib/i18n';
import { updateStudyPlan } from '@/app/actions/exam';
import { changePassword, logoutEverywhere, updateProfile } from '@/app/actions/auth';
import { Card, PageHeading, Badge } from '@/components/ui';
import { PasswordForm, ProfileForm, TotpSection } from '@/components/settings-forms';

export const metadata: Metadata = { title: 'Instellingen' };

function toDateInput(timestamp: number | null): string {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

export default async function SettingsPage() {
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

  const activeSessions = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, session.user.id))
    .orderBy(desc(sessions.createdAt));

  const recentSecurityEvents = await db
    .select()
    .from(auditLog)
    .where(eq(auditLog.userId, session.user.id))
    .orderBy(desc(auditLog.createdAt))
    .limit(8);

  const totpEnabled = Boolean(session.user.totpEnabledAt);

  return (
    <>
      <PageHeading title={t('settings.title')} />

      <div className="space-y-6">
        <Card>
          <h2 className="mb-4 font-semibold">{t('settings.profile')}</h2>
          <ProfileForm
            action={updateProfile}
            defaults={{ displayName: session.user.displayName, locale }}
            labels={{
              name: t('settings.name'),
              language: t('settings.language'),
              languageHint: t('settings.languageDesc'),
              dutch: t('common.language.nl'),
              english: t('common.language.en'),
              submit: t('settings.save'),
              saved: t('settings.saved'),
            }}
          />
        </Card>

        {/* Studieplan per certificering */}
        {certs.map((cert) => {
          const plan = plans.find((p) => p.certificationId === cert.id);
          const title = locale === 'nl' ? cert.titleNl : cert.titleEn;

          return (
            <Card key={cert.id}>
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: cert.accentColor }}
                  aria-hidden="true"
                />
                <h2 className="font-semibold">{title}</h2>
              </div>

              <form action={updateStudyPlan} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="certificationId" value={cert.id} />

                <div>
                  <label className="p115-label" htmlFor={`examDate-${cert.id}`}>
                    {t('settings.examDate')}
                  </label>
                  <input
                    id={`examDate-${cert.id}`}
                    name="examDate"
                    type="date"
                    defaultValue={toDateInput(plan?.examDate ?? null)}
                    className="p115-input"
                  />
                </div>

                <div>
                  <label className="p115-label" htmlFor={`target-${cert.id}`}>
                    {t('settings.dailyTarget')}
                  </label>
                  <input
                    id={`target-${cert.id}`}
                    name="dailyReviewTarget"
                    type="number"
                    min={5}
                    max={200}
                    defaultValue={plan?.dailyReviewTarget ?? 30}
                    className="p115-input"
                  />
                </div>

                <div>
                  <label className="p115-label" htmlFor={`locale-${cert.id}`}>
                    Oefentaal
                  </label>
                  <select
                    id={`locale-${cert.id}`}
                    name="preferredLocale"
                    defaultValue={plan?.preferredLocale ?? locale}
                    className="p115-input"
                  >
                    <option value="nl">{t('common.language.nl')}</option>
                    <option value="en">{t('common.language.en')}</option>
                  </select>
                  <p className="mt-1.5 text-xs" style={{ color: 'var(--text-subtle)' }}>
                    Het echte examen is {cert.examLanguage === 'en' ? 'Engelstalig' : 'Nederlandstalig'}.
                  </p>
                </div>

                {cert.extraTimeMinutes > 0 ? (
                  <div className="flex items-end">
                    <label className="flex items-start gap-2.5 text-sm">
                      <input
                        type="checkbox"
                        name="useExtraTime"
                        defaultChecked={plan?.useExtraTime ?? false}
                        className="mt-0.5"
                      />
                      <span style={{ color: 'var(--text-muted)' }}>
                        {t('settings.extraTime')}
                      </span>
                    </label>
                  </div>
                ) : null}

                <div className="sm:col-span-2">
                  <button type="submit" className="p115-btn p115-btn-primary text-sm">
                    {t('settings.save')}
                  </button>
                </div>
              </form>
            </Card>
          );
        })}

        {/* Beveiliging */}
        <Card>
          <h2 className="mb-4 font-semibold">{t('settings.security')}</h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-medium">{t('settings.changePassword')}</h3>
              <PasswordForm
                action={changePassword}
                labels={{
                  current: t('settings.currentPassword'),
                  next: t('settings.newPassword'),
                  submit: t('settings.save'),
                  saved: t('settings.saved'),
                }}
              />
            </div>

            <div className="border-t pt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium">{t('settings.twoFactor')}</h3>
                <Badge tone={totpEnabled ? 'success' : 'neutral'}>
                  {totpEnabled ? t('settings.twoFactorOn') : t('settings.twoFactorOff')}
                </Badge>
              </div>
              <TotpSection
                enabled={totpEnabled}
                labels={{
                  enable: t('settings.enable'),
                  disable: t('settings.disable'),
                  code: t('auth.totpCode'),
                  password: t('auth.password'),
                  verify: t('auth.verify'),
                  cancel: t('common.cancel'),
                }}
              />
            </div>

            <div className="border-t pt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium">{t('settings.sessions')}</h3>
                <form action={logoutEverywhere}>
                  <button type="submit" className="p115-btn p115-btn-secondary px-3 py-1.5 text-sm">
                    {t('settings.logoutAll')}
                  </button>
                </form>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {activeSessions.length} actieve{' '}
                {activeSessions.length === 1 ? 'sessie' : 'sessies'}.
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-3 text-sm font-medium">Recente beveiligingsgebeurtenissen</h3>
              <ul className="space-y-1.5 text-sm">
                {recentSecurityEvents.map((event) => (
                  <li key={event.id} className="flex items-center justify-between gap-3">
                    <span style={{ color: 'var(--text-muted)' }}>{event.event}</span>
                    <span className="flex items-center gap-2 text-xs">
                      <span style={{ color: 'var(--text-subtle)' }}>
                        {new Date(event.createdAt * 1000).toLocaleString(
                          locale === 'nl' ? 'nl-NL' : 'en-GB',
                          { dateStyle: 'short', timeStyle: 'short' },
                        )}
                      </span>
                      <Badge tone={event.outcome === 'success' ? 'success' : 'danger'}>
                        {event.outcome}
                      </Badge>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Gegevens */}
        <Card>
          <h2 className="mb-2 font-semibold">{t('settings.exportData')}</h2>
          <p className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            {t('settings.exportDesc')} Je studiegegevens staan uitsluitend op deze
            machine en worden nergens naartoe gestuurd.
          </p>
          <a href="/api/export" className="p115-btn p115-btn-secondary text-sm" download>
            {t('settings.exportData')}
          </a>
        </Card>

        {/* Handelsmerken. Voorwaarde 3 van de licentie vraagt deze vermelding
            in de software, niet alleen in de documentatie. De Android-schil
            heeft hem onder Instellingen > Over; dit is de tegenhanger daarvan. */}
        <Card>
          <h2 className="mb-2 font-semibold">{t('about.trademarks')}</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {t('about.trademarksBody')}
          </p>
        </Card>
      </div>
    </>
  );
}
