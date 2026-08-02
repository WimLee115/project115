import { useRef, useState } from 'react';

import { useApp } from '@/app/app-state';
import {
  Badge,
  ErrorNote,
  Loading,
  PageHeading,
  Row,
  Section,
  Note,
  SelectedMark,
  Sheet,
  Toggle,
} from '@/components/ui';
import { certifications, glossary, pick, questions } from '@/lib/content';
import { fromDateInput, toDateInput } from '@/lib/format';
import { isValidPin, removePin, setPin, verifyPin } from '@/lib/lock';
import { newId } from '@/lib/id';
import { LOCALES, type Locale } from '@/lib/i18n';
import {
  allPlans,
  clearStudyData,
  getSettings,
  putPlan,
  type StudyPlanRow,
} from '@/lib/store';
import { exportToFile, importFromJson } from '@/lib/transfer';
import { useAsync } from '@/lib/use-async';
import { APP_VERSION, SOURCE_URL, REPORT_URL } from '@/lib/version';

/**
 * Instellingen.
 *
 * Alles wat de app onthoudt staat hier, inclusief de knoppen waarmee je het
 * weer kwijtraakt. Dat laatste bewust in hetzelfde scherm en niet verstopt: het
 * is jouw toestel en jouw voortgang, en een app die zijn eigen uitgang
 * verbergt, verdient je studiegegevens niet.
 */

const THEMES = [
  { value: 'system' as const, key: 'settings.themeSystem' as const },
  { value: 'light' as const, key: 'settings.themeLight' as const },
  { value: 'dark' as const, key: 'settings.themeDark' as const },
];

type Dialog = 'setPin' | 'removePin' | 'reset' | 'import' | null;

export function SettingsScreen() {
  const { t, locale, settings, update, refreshDue } = useApp();

  const { data, loading, reload } = useAsync(() => allPlans(), []);

  const [name, setName] = useState(settings.displayName);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);
  const pendingImport = useRef<string | null>(null);

  if (loading || !data) return <Loading label={t('common.loading')} />;

  /** Werkt het studieplan bij, of maakt er een aan als het er nog niet is. */
  const savePlan = async (certificationId: string, patch: Partial<StudyPlanRow>) => {
    const now = Math.floor(Date.now() / 1000);
    const existing = data.find((row) => row.certificationId === certificationId);

    const plan: StudyPlanRow = existing
      ? { ...existing, ...patch, updatedAt: now }
      : {
          id: newId('plan'),
          certificationId,
          examDate: null,
          dailyReviewTarget: 30,
          useExtraTime: false,
          preferredLocale: locale,
          createdAt: now,
          updatedAt: now,
          ...patch,
        };

    await putPlan(plan);
    reload();
  };

  const doExport = async () => {
    setBusy(true);
    setFailure(null);
    try {
      const result = await exportToFile();
      setNotice(`${t('settings.exported')} ${result.location}`);
    } catch {
      setFailure(t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  const pickFile = () => {
    setFailure(null);
    fileInput.current?.click();
  };

  const onFileChosen = async (file: File | undefined) => {
    if (!file) return;
    // Eerst inlezen, dan pas bevestigen: een onleesbaar bestand hoeft geen
    // waarschuwing over gegevensverlies op te leveren.
    try {
      pendingImport.current = await file.text();
      setDialog('import');
    } catch {
      setFailure(t('settings.importFailed'));
    }
  };

  const runImport = async () => {
    const text = pendingImport.current;
    if (!text) return;

    setBusy(true);
    setFailure(null);

    try {
      const summary = await importFromJson(text);
      setNotice(
        `${t('settings.imported')} ${summary.attempts} × ${t('stats.attempts').toLowerCase()}, ${summary.cards} ${t('dashboard.cards')}`,
      );
      await refreshDue();
      reload();
    } catch (cause) {
      setFailure(cause instanceof Error ? cause.message : t('settings.importFailed'));
    } finally {
      pendingImport.current = null;
      setBusy(false);
      setDialog(null);
    }
  };

  const closePinDialog = () => {
    setPin1('');
    setPin2('');
    setPinError(null);
    setDialog(null);
  };

  /**
   * `setPin` en `removePin` schrijven rechtstreeks naar de opslag. De
   * app-toestand weet daar niets van, dus die leest hier opnieuw in — anders
   * denkt dit scherm nog dat er geen pincode is.
   */
  const syncPinState = async () => {
    const stored = await getSettings();
    await update({ pin: stored.pin, lockOnBackground: stored.lockOnBackground });
  };

  const submitPin = async () => {
    setPinError(null);

    if (settings.pin) {
      // Wijzigen mag alleen met de huidige pincode erbij.
      const check = await verifyPin(pin1);
      if (!check.ok) {
        setPinError(check.waitSeconds > 0 ? t('lock.tooMany') : t('lock.wrong'));
        return;
      }
      if (!isValidPin(pin2)) {
        setPinError(t('lock.tooShort'));
        return;
      }
      await setPin(pin2);
    } else {
      if (!isValidPin(pin1)) {
        setPinError(t('lock.tooShort'));
        return;
      }
      if (pin1 !== pin2) {
        setPinError(t('lock.mismatch'));
        return;
      }
      await setPin(pin1);
    }

    await syncPinState();
    closePinDialog();
  };

  const dropPin = async () => {
    setPinError(null);
    const check = await verifyPin(pin1);
    if (!check.ok) {
      setPinError(check.waitSeconds > 0 ? t('lock.tooMany') : t('lock.wrong'));
      return;
    }

    await removePin();
    await syncPinState();
    closePinDialog();
  };

  const wipe = async () => {
    setBusy(true);
    await clearStudyData();
    await refreshDue();
    setBusy(false);
    setDialog(null);
    setNotice(t('settings.saved'));
    reload();
  };

  return (
    <div className="pt-5">
      <PageHeading title={t('settings.title')} subtitle={t('app.author')} />

      {notice ? (
        <div
          className="mb-4 rounded-xl p-3 text-sm"
          style={{ background: 'var(--success-soft)', color: 'var(--success)' }}
          role="status"
        >
          {notice}
        </div>
      ) : null}

      {failure ? (
        <div className="mb-4">
          <ErrorNote message={failure} />
        </div>
      ) : null}

      <Section title={t('settings.name')}>
        <div className="px-4 py-3.5">
          <input
            className="p115-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-label={t('settings.name')}
          />
          <button
            type="button"
            className="p115-btn p115-btn-secondary mt-3 w-full text-sm"
            onClick={() => {
              void update({ displayName: name.trim() });
              setNotice(t('settings.saved'));
            }}
            disabled={name.trim() === settings.displayName}
          >
            {t('settings.save')}
          </button>
        </div>
      </Section>

      <Section title={t('settings.language')} description={t('settings.languageDesc')}>
        {LOCALES.map((option: Locale) => (
          <Row
            key={option}
            label={option === 'nl' ? t('common.language.nl') : t('common.language.en')}
            onClick={() => void update({ locale: option })}
            trailing={<SelectedMark active={settings.locale === option} />}
          />
        ))}
      </Section>

      <Section title={t('settings.theme')}>
        {THEMES.map((option) => (
          <Row
            key={option.value}
            label={t(option.key)}
            onClick={() => void update({ theme: option.value })}
            trailing={<SelectedMark active={settings.theme === option.value} />}
          />
        ))}
      </Section>

      {certifications.map((certification) => {
        const plan = data.find((row) => row.certificationId === certification.id);
        return (
          <Section
            key={certification.id}
            title={`${t('settings.studyPlan')} — ${certification.provider}`}
            description={pick(locale, certification.titleNl, certification.titleEn)}
          >
            <div className="px-4 py-3.5">
              <label className="p115-label" htmlFor={`date-${certification.id}`}>
                {t('settings.examDate')}
              </label>
              <input
                id={`date-${certification.id}`}
                type="date"
                className="p115-input"
                value={plan?.examDate != null ? toDateInput(plan.examDate) : ''}
                onChange={(event) =>
                  void savePlan(certification.id, {
                    examDate: fromDateInput(event.target.value),
                  })
                }
              />
            </div>

            <div className="px-4 py-3.5">
              <label className="p115-label" htmlFor={`target-${certification.id}`}>
                {t('settings.dailyTarget')}
              </label>
              <input
                id={`target-${certification.id}`}
                type="number"
                inputMode="numeric"
                min={5}
                max={200}
                step={5}
                className="p115-input"
                value={plan?.dailyReviewTarget ?? 30}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  if (!Number.isFinite(value)) return;
                  void savePlan(certification.id, {
                    dailyReviewTarget: Math.max(5, Math.min(200, Math.round(value))),
                  });
                }}
              />
              <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {t('settings.dailyTargetDesc')}
              </p>
            </div>

            <Row
              label={t('settings.extraTime')}
              hint={`+${certification.extraTimeMinutes} ${t('common.minutes')}`}
              trailing={
                <Toggle
                  checked={plan?.useExtraTime ?? false}
                  onChange={(value) => void savePlan(certification.id, { useExtraTime: value })}
                  label={t('settings.extraTime')}
                />
              }
            />
          </Section>
        );
      })}

      <Section title={t('settings.security')} description={t('settings.pinDesc')}>
        <Row
          label={t('settings.pin')}
          value={settings.pin ? t('settings.pinOn') : t('settings.pinOff')}
          onClick={() => {
            setPin1('');
            setPin2('');
            setPinError(null);
            setDialog('setPin');
          }}
        />
        {settings.pin ? (
          <>
            <Row
              label={t('settings.lockOnBackground')}
              trailing={
                <Toggle
                  checked={settings.lockOnBackground}
                  onChange={(value) => void update({ lockOnBackground: value })}
                  label={t('settings.lockOnBackground')}
                />
              }
            />
            <Row
              label={t('lock.remove')}
              danger
              onClick={() => {
                setPin1('');
                setPinError(null);
                setDialog('removePin');
              }}
            />
          </>
        ) : null}
        <Row
          label={t('dashboard.dueToday')}
          hint={t('nav.review')}
          trailing={
            <Toggle
              checked={settings.showDueBadge}
              onChange={(value) => void update({ showDueBadge: value })}
              label={t('dashboard.dueToday')}
            />
          }
        />
      </Section>

      <Section title={t('settings.data')} description={t('settings.exportDesc')}>
        <Row label={t('settings.exportData')} onClick={() => void doExport()} disabled={busy} />
        <Row label={t('settings.importData')} hint={t('settings.importDesc')} onClick={pickFile} />
        <Row label={t('settings.reset')} hint={t('settings.resetDesc')} danger onClick={() => setDialog('reset')} />
      </Section>

      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          void onFileChosen(event.target.files?.[0]);
          // Leegmaken, anders vuurt hetzelfde bestand een tweede keer niet.
          event.target.value = '';
        }}
      />

      <Section title={t('settings.about')}>
        <Row label={t('settings.version')} value={APP_VERSION} />
        <Row
          label={t('settings.contentStats')}
          value={`${questions.length} / ${glossary.length}`}
          hint={`${t('common.questions')} / ${t('glossary.terms')}`}
        />
        <Row label={t('app.name')} hint={t('app.author')} />
        <div className="px-4 py-3.5">
          <Badge tone="info">{t('common.offline')}</Badge>
        </div>
      </Section>

      <Section title={t('about.source')} description={t('about.sourceBody')}>
        {/*
          Een echte link en geen knop. Capacitor stuurt een adres buiten de app
          naar de browser van het toestel, en in de browserversie doet hij wat
          een link hoort te doen. Dit is de enige plek waar de app naar buiten
          wijst, en pas nadat je er zelf op tikt.
        */}
        <a
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left no-underline"
          href={SOURCE_URL}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[0.9375rem] font-medium">GitHub</span>
            <span className="mt-0.5 block text-xs" style={{ color: 'var(--text-muted)' }}>
              {SOURCE_URL.replace('https://', '')}
            </span>
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="flex-shrink-0"
            style={{ color: 'var(--text-subtle)' }}
          >
            <path
              d="M14 5h5v5M19 5l-8 8M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </Section>

      {/*
        De uitnodiging staat vlak onder de broncode-link, want dat is waar
        iemand die net gezien heeft dat de app open is, zich afvraagt of hij
        er zelf iets mee kan. Een docent die een fout in een vraag ziet is de
        beste corrector die dit project heeft: hij kent de stof en hij merkt
        het meteen.
      */}
      <Section title={t('about.contribute')} description={t('about.contributeBody')}>
        <a
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left no-underline"
          href={REPORT_URL}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[0.9375rem] font-medium">
              {t('about.contributeCta')}
            </span>
            <span className="mt-0.5 block text-xs" style={{ color: 'var(--text-muted)' }}>
              github.com/WimLee115/project115
            </span>
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="flex-shrink-0"
            style={{ color: 'var(--text-subtle)' }}
          >
            <path
              d="M14 5h5v5M19 5l-8 8M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </Section>

      {/*
        Deze drie blokken staan er omdat de app gedeeld wordt met andere
        docenten. Wie hem van een collega krijgt, hoort zonder te hoeven vragen
        te kunnen zien wat de app met zijn gegevens doet, waar de vragen vandaan
        komen en van wie de merknamen zijn.
      */}
      <Section title={t('about.privacy')}>
        <Note>{t('about.privacyBody')}</Note>
      </Section>

      <Section title={t('about.content')}>
        <Note>{t('about.contentBody')}</Note>
        <Note>{t('about.disclaimer')}</Note>
      </Section>

      <Section title={t('about.trademarks')}>
        <Note>{t('about.trademarksBody')}</Note>
      </Section>

      <Sheet
        open={dialog === 'setPin'}
        onClose={closePinDialog}
        title={settings.pin ? t('settings.change') : t('lock.setTitle')}
        actions={
          <>
            <button
              type="button"
              className="p115-btn p115-btn-secondary flex-1"
              onClick={closePinDialog}
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="p115-btn p115-btn-primary flex-1"
              onClick={() => void submitPin()}
            >
              {t('settings.save')}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-muted)' }}>{t('lock.setIntro')}</p>

        <label className="p115-label mt-4" htmlFor="pin1">
          {settings.pin ? t('lock.currentPin') : t('lock.newPin')}
        </label>
        <input
          id="pin1"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={8}
          className="p115-input"
          value={pin1}
          onChange={(event) => setPin1(event.target.value.replace(/\D/g, ''))}
        />

        <label className="p115-label mt-3" htmlFor="pin2">
          {settings.pin ? t('lock.newPin') : t('lock.repeatPin')}
        </label>
        <input
          id="pin2"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={8}
          className="p115-input"
          value={pin2}
          onChange={(event) => setPin2(event.target.value.replace(/\D/g, ''))}
        />

        {pinError ? (
          <p className="mt-3 text-sm" style={{ color: 'var(--danger)' }} role="alert">
            {pinError}
          </p>
        ) : null}
      </Sheet>

      <Sheet
        open={dialog === 'removePin'}
        onClose={closePinDialog}
        title={t('lock.remove')}
        actions={
          <>
            <button
              type="button"
              className="p115-btn p115-btn-secondary flex-1"
              onClick={closePinDialog}
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="p115-btn p115-btn-danger flex-1"
              onClick={() => void dropPin()}
            >
              {t('common.remove')}
            </button>
          </>
        }
      >
        <label className="p115-label" htmlFor="pin-current">
          {t('lock.currentPin')}
        </label>
        <input
          id="pin-current"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={8}
          className="p115-input"
          value={pin1}
          onChange={(event) => setPin1(event.target.value.replace(/\D/g, ''))}
        />
        {pinError ? (
          <p className="mt-3 text-sm" style={{ color: 'var(--danger)' }} role="alert">
            {pinError}
          </p>
        ) : null}
      </Sheet>

      <Sheet
        open={dialog === 'import'}
        onClose={() => {
          pendingImport.current = null;
          setDialog(null);
        }}
        title={t('settings.importData')}
        actions={
          <>
            <button
              type="button"
              className="p115-btn p115-btn-secondary flex-1"
              onClick={() => {
                pendingImport.current = null;
                setDialog(null);
              }}
              disabled={busy}
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="p115-btn p115-btn-primary flex-1"
              onClick={() => void runImport()}
              disabled={busy}
            >
              {t('common.confirm')}
            </button>
          </>
        }
      >
        <p>{t('settings.importConfirm')}</p>
      </Sheet>

      <Sheet
        open={dialog === 'reset'}
        onClose={() => setDialog(null)}
        title={t('settings.reset')}
        actions={
          <>
            <button
              type="button"
              className="p115-btn p115-btn-secondary flex-1"
              onClick={() => setDialog(null)}
              disabled={busy}
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="p115-btn p115-btn-danger flex-1"
              onClick={() => void wipe()}
              disabled={busy}
            >
              {t('common.remove')}
            </button>
          </>
        }
      >
        <p>{t('settings.resetConfirm')}</p>
      </Sheet>
    </div>
  );
}
