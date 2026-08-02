import { useState } from 'react';

import { useApp } from '@/app/app-state';
import { ErrorNote, Loading, PageHeading, Row, Section, SelectedMark } from '@/components/ui';
import { certifications, pick } from '@/lib/content';
import { startAttempt } from '@/lib/exam';
import { useRouter } from '@/lib/router';
import { getWeakObjectiveIds } from '@/lib/stats';
import { getMeta } from '@/lib/store';
import { useAsync } from '@/lib/use-async';

/**
 * Instelscherm voor een oefensessie.
 *
 * Twee keuzes die er werkelijk toe doen: waarover, en hoe lang. De taal volgt
 * de interfacetaal en niet de examentaal — bij oefenen is begrijpen wat er
 * staat het doel, niet de taaldruk oefenen. Dat laatste doe je in het
 * proefexamen.
 */

const LENGTHS = [10, 20, 30] as const;

export function PracticeSetupScreen() {
  const { t, locale } = useApp();
  const { navigate } = useRouter();

  const [selected, setSelected] = useState<string | null>(null);
  const [weakOnly, setWeakOnly] = useState(false);
  const [count, setCount] = useState<number>(20);
  const [starting, setStarting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const { data, loading } = useAsync(async () => {
    const last = await getMeta<string>('lastCertification');
    return { last: last ?? null };
  }, []);

  const fallback = certifications[0]?.id ?? '';
  const activeId =
    selected ??
    (data?.last && certifications.some((row) => row.id === data.last) ? data.last : fallback);

  // De zwakke plekken hangen aan de gekozen certificering, dus opnieuw ophalen
  // zodra die wisselt.
  const weak = useAsync(() => getWeakObjectiveIds(activeId), [activeId]);

  if (loading || !data) return <Loading label={t('common.loading')} />;

  const certification = certifications.find((row) => row.id === activeId);
  const weakIds = weak.data ?? [];
  const canFocus = weakIds.length > 0;

  const start = async () => {
    if (!certification) return;
    setStarting(true);
    setFailure(null);

    const focused = weakOnly && canFocus;

    try {
      const { attemptId } = await startAttempt({
        certificationId: certification.id,
        mode: focused ? 'weakspot' : 'practice',
        locale,
        count,
        ...(focused ? { objectiveIds: weakIds } : {}),
      });
      navigate(`/practice/${attemptId}`, { replace: true });
    } catch (cause) {
      setFailure(cause instanceof Error ? cause.message : t('common.error'));
      setStarting(false);
    }
  };

  return (
    <div className="pt-5">
      <PageHeading title={t('practice.title')} subtitle={t('practice.subtitle')} />

      <Section title={t('exam.chooseCertification')}>
        {certifications.map((option) => (
          <Row
            key={option.id}
            label={pick(locale, option.titleNl, option.titleEn)}
            hint={option.provider}
            onClick={() => {
              setSelected(option.id);
              setWeakOnly(false);
            }}
            trailing={<SelectedMark active={option.id === activeId} />}
          />
        ))}
      </Section>

      <Section
        title={t('practice.focus')}
        description={canFocus ? t('practice.weakSpotsDesc') : t('practice.noWeakSpots')}
      >
        <Row
          label={t('practice.allObjectives')}
          onClick={() => setWeakOnly(false)}
          trailing={<SelectedMark active={!weakOnly || !canFocus} />}
        />
        <Row
          label={t('practice.weakSpots')}
          {...(canFocus
            ? { hint: `${weakIds.length} × ${t('common.objective').toLowerCase()}` }
            : {})}
          onClick={() => canFocus && setWeakOnly(true)}
          disabled={!canFocus}
          trailing={<SelectedMark active={weakOnly && canFocus} />}
        />
      </Section>

      <Section title={t('practice.sessionLength')}>
        {LENGTHS.map((length) => (
          <Row
            key={length}
            label={`${length} ${t('common.questions')}`}
            onClick={() => setCount(length)}
            trailing={<SelectedMark active={count === length} />}
          />
        ))}
      </Section>

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
        {t('practice.startPractice')}
      </button>
    </div>
  );
}
