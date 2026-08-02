import { useState } from 'react';

import { useApp } from '@/app/app-state';
import {
  Badge,
  Card,
  ErrorNote,
  Loading,
  PageHeading,
  Row,
  Section,
  SelectedMark,
  Toggle,
} from '@/components/ui';
import { certifications, pick } from '@/lib/content';
import { startAttempt } from '@/lib/exam';
import { useRouter } from '@/lib/router';
import { allPlans, getMeta } from '@/lib/store';
import { useAsync } from '@/lib/use-async';

/**
 * Instelscherm voor een proefexamen.
 *
 * De condities staan hier expliciet — aantal vragen, tijd, cesuur, taal —
 * omdat een proefexamen alleen iets zegt als het onder dezelfde druk gebeurt
 * als het echte. De taal is dus niet instelbaar: PeopleCert neemt ITIL in het
 * Engels af en EXIN neemt ISFS in het Nederlands af, en op je examendag kun je
 * daar ook niet omheen.
 */

export function ExamSetupScreen() {
  const { t, locale } = useApp();
  const { navigate } = useRouter();

  const [selected, setSelected] = useState<string | null>(null);
  /** `null` betekent: nog niet zelf gekozen, dus het studieplan bepaalt het. */
  const [extraTime, setExtraTime] = useState<boolean | null>(null);
  const [starting, setStarting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const { data, loading } = useAsync(async () => {
    const [last, plans] = await Promise.all([
      getMeta<string>('lastCertification'),
      allPlans(),
    ]);
    return { last: last ?? null, plans };
  }, []);

  if (loading || !data) return <Loading label={t('common.loading')} />;

  const fallback = certifications[0]?.id ?? '';
  const activeId = selected ?? (data.last && certifications.some((c) => c.id === data.last) ? data.last : fallback);
  const certification = certifications.find((c) => c.id === activeId);

  // Het studieplan bepaalt de beginstand van de schakelaar; daarna wint wat je
  // op dit scherm kiest.
  const plan = data.plans.find((row) => row.certificationId === activeId);
  const useExtra = extraTime ?? plan?.useExtraTime ?? false;

  const start = async () => {
    if (!certification) return;
    setStarting(true);
    setFailure(null);

    try {
      const { attemptId } = await startAttempt({
        certificationId: certification.id,
        mode: 'exam',
        // Het echte examen is in deze taal; oefenen in een andere taal maakt de
        // simulatie waardeloos.
        locale: certification.examLanguage,
        extraTime: useExtra,
      });
      navigate(`/exam/${attemptId}`, { replace: true });
    } catch (cause) {
      setFailure(cause instanceof Error ? cause.message : t('common.error'));
      setStarting(false);
    }
  };

  const minutes = certification
    ? certification.durationMinutes + (useExtra ? certification.extraTimeMinutes : 0)
    : 0;

  return (
    <div className="pt-5">
      <PageHeading title={t('exam.setupTitle')} subtitle={t('exam.noFeedback')} />

      <Section title={t('exam.chooseCertification')}>
        {certifications.map((option) => (
          <Row
            key={option.id}
            label={pick(locale, option.titleNl, option.titleEn)}
            hint={`${option.provider} · ${option.questionCount} ${t('common.questions')} · ${option.durationMinutes} ${t('common.minutes')}`}
            onClick={() => {
              setSelected(option.id);
              // Terug naar de standaard van het studieplan van dít examen.
              setExtraTime(null);
            }}
            trailing={<SelectedMark active={option.id === activeId} />}
          />
        ))}
      </Section>

      {certification ? (
        <>
          <Card className="mb-5">
            <h2 className="text-sm font-semibold">{t('exam.conditions')}</h2>
            <dl className="mt-3 grid grid-cols-2 gap-y-3 text-sm">
              <dt style={{ color: 'var(--text-muted)' }}>{t('common.questions')}</dt>
              <dd className="text-right font-medium tabular-nums">
                {certification.questionCount}
              </dd>

              <dt style={{ color: 'var(--text-muted)' }}>{t('exam.timeLeft')}</dt>
              <dd className="text-right font-medium tabular-nums">
                {minutes} {t('common.minutes')}
              </dd>

              <dt style={{ color: 'var(--text-muted)' }}>{t('result.passMark')}</dt>
              <dd className="text-right font-medium tabular-nums">
                {certification.passMark}/{certification.questionCount}
              </dd>

              <dt style={{ color: 'var(--text-muted)' }}>{t('settings.language')}</dt>
              <dd className="text-right">
                <Badge tone="info">
                  {certification.examLanguage === 'nl'
                    ? t('common.language.nl')
                    : t('common.language.en')}
                </Badge>
              </dd>
            </dl>
          </Card>

          <Section description={t('exam.aboutToStart')}>
            <Row
              label={t('exam.extraTime')}
              hint={`+${certification.extraTimeMinutes} ${t('common.minutes')}`}
              trailing={
                <Toggle
                  checked={useExtra}
                  onChange={setExtraTime}
                  label={t('exam.extraTime')}
                />
              }
            />
          </Section>
        </>
      ) : null}

      {failure ? (
        <div className="mb-4">
          <ErrorNote message={failure} />
        </div>
      ) : null}

      <button
        type="button"
        className="p115-btn p115-btn-primary w-full"
        onClick={() => void start()}
        disabled={starting || !certification}
      >
        {t('exam.start')}
      </button>
    </div>
  );
}
