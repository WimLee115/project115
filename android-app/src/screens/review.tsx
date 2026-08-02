import { useEffect, useRef, useState } from 'react';

import { useApp } from '@/app/app-state';
import { Explanation, OptionButton, QuestionStem } from '@/components/question';
import {
  Badge,
  Card,
  EmptyState,
  ErrorNote,
  Loading,
  PageHeading,
  ProgressBar,
} from '@/components/ui';
import { certifications, pick } from '@/lib/content';
import { addGlossaryToReview, getReviewQueue, type ReviewItem } from '@/lib/review';
import { useRouter } from '@/lib/router';
import { countReviewsToday, formatInterval, previewIntervals, reviewCard, suspendCard } from '@/lib/srs';
import { allPlans, getCard, type FsrsCardRow } from '@/lib/store';
import { useAsync } from '@/lib/use-async';

/**
 * Herhaalsessie.
 *
 * De wachtrij komt van FSRS: alleen wat vandaag aan de beurt is. Dat is het
 * hele punt van spaced repetition — je herhaalt niet wat je toch al weet, maar
 * wat je op het punt staat te vergeten.
 *
 * Twee soorten kaarten door elkaar. Bij een examenvraag kies je eerst een
 * antwoord: dan meet je herkenning en niet je stemming over hoe goed het ging.
 * Bij een begrip kun je dat niet meten, dus daar beoordeel je jezelf — met de
 * definitie ernaast, zodat het oordeel ergens op slaat.
 */

const RATINGS = [
  { value: 1 as const, key: 'review.again' as const, tone: 'danger' as const },
  { value: 2 as const, key: 'review.hard' as const, tone: 'warning' as const },
  { value: 3 as const, key: 'review.good' as const, tone: 'success' as const },
  { value: 4 as const, key: 'review.easy' as const, tone: 'info' as const },
];

interface ReviewData {
  queue: ReviewItem[];
  reviewedToday: number;
  target: number;
}

export function ReviewScreen() {
  const { t, locale, refreshDue } = useApp();
  const { navigate } = useRouter();

  const { data, error, loading, reload } = useAsync<ReviewData>(async () => {
    const [queue, reviewedToday, plans] = await Promise.all([
      getReviewQueue(locale, 25),
      countReviewsToday(),
      allPlans(),
    ]);

    // Het hoogste dagdoel van de plannen; twee examens tegelijk voorbereiden
    // betekent niet dat je het laagste doel mag aanhouden.
    const target = plans.reduce((highest, plan) => Math.max(highest, plan.dailyReviewTarget), 0);

    return { queue, reviewedToday, target: target > 0 ? target : 30 };
  }, [locale]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [card, setCard] = useState<FsrsCardRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const startedAt = useRef(Date.now());
  const item = data?.queue[index];

  useEffect(() => {
    startedAt.current = Date.now();
    setRevealed(false);
    setSelected(null);
    setCard(null);
  }, [index]);

  // De voorspelde intervallen horen bij deze kaart; ze worden pas opgehaald
  // wanneer het antwoord in beeld is, want eerder heb je er niets aan.
  useEffect(() => {
    if (!revealed || !item) return;
    let active = true;
    void getCard(item.cardId).then((row) => {
      if (active) setCard(row ?? null);
    });
    return () => {
      active = false;
    };
  }, [revealed, item]);

  if (loading) return <Loading label={t('common.loading')} />;

  if (error || !data) {
    return (
      <div className="pt-5">
        <ErrorNote message={t('common.error')} onRetry={reload} retryLabel={t('common.confirm')} />
      </div>
    );
  }

  const rate = async (rating: 1 | 2 | 3 | 4) => {
    if (!item || busy) return;
    setBusy(true);

    await reviewCard(item.cardId, rating, Date.now() - startedAt.current);
    await refreshDue();

    setBusy(false);
    setIndex((value) => value + 1);
  };

  const suspend = async () => {
    if (!item || busy) return;
    setBusy(true);
    await suspendCard(item.cardId);
    await refreshDue();
    setBusy(false);
    setIndex((value) => value + 1);
  };

  const addGlossary = async (certificationId: string) => {
    setBusy(true);
    const { added } = await addGlossaryToReview(certificationId);
    setBusy(false);
    setMessage(added > 0 ? `${added} ${t('review.added')}` : t('review.allAdded'));
    if (added > 0) {
      await refreshDue();
      reload();
    }
  };

  const done = data.queue.length === 0 || index >= data.queue.length;
  // Eén keer uitrekenen voor alle vier de knoppen; `previewIntervals` laat de
  // planner vier scenario's doorrekenen en dat hoeft niet per knop opnieuw.
  const intervals = card ? previewIntervals(card) : null;

  return (
    <div className="pt-5">
      <PageHeading
        title={t('review.title')}
        subtitle={`${data.reviewedToday} ${t('review.reviewedToday')} · ${data.target} ${t('review.target')}`}
        actions={
          done ? null : (
            <Badge tone="accent">
              {data.queue.length - index} {t('review.remaining')}
            </Badge>
          )
        }
      />

      <div className="mb-5">
        <ProgressBar
          value={data.reviewedToday}
          max={Math.max(1, data.target)}
          tone="accent"
          height={6}
          label={t('review.target')}
        />
      </div>

      {done ? (
        <>
          <EmptyState
            title={data.queue.length === 0 ? t('review.noneDue') : t('review.sessionDone')}
            description={t('practice.subtitle')}
            action={
              <button
                type="button"
                className="p115-btn p115-btn-primary"
                onClick={() => navigate('/practice')}
              >
                {t('practice.startPractice')}
              </button>
            }
          />

          <section className="mt-6">
            <h2
              className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide"
              style={{ color: 'var(--text-subtle)' }}
            >
              {t('review.addGlossary')}
            </h2>
            <div className="space-y-2">
              {certifications.map((certification) => (
                <button
                  key={certification.id}
                  type="button"
                  className="p115-btn p115-btn-secondary w-full justify-start text-left"
                  onClick={() => void addGlossary(certification.id)}
                  disabled={busy}
                >
                  {pick(locale, certification.titleNl, certification.titleEn)}
                </button>
              ))}
            </div>
            {message ? (
              <p className="mt-3 px-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                {message}
              </p>
            ) : null}
          </section>
        </>
      ) : item ? (
        <>
          <Card>
            {item.question ? (
              <>
                <p className="mb-3 text-xs font-medium" style={{ color: 'var(--text-subtle)' }}>
                  {t('common.objective')} {item.question.objectiveCode}
                </p>

                <QuestionStem
                  stem={item.question.stem}
                  {...(item.question.listItems ? { listItems: item.question.listItems } : {})}
                />

                <div className="mt-4 space-y-2.5">
                  {item.question.options.map((option) => (
                    <OptionButton
                      key={option.id}
                      label={option.label}
                      text={option.text}
                      selected={!revealed && selected === option.id}
                      state={
                        !revealed
                          ? null
                          : option.isCorrect
                            ? 'correct'
                            : option.id === selected
                              ? 'incorrect'
                              : null
                      }
                      disabled={revealed}
                      footnote={revealed ? option.rationale : null}
                      onClick={() => {
                        if (revealed) return;
                        setSelected(option.id);
                        setRevealed(true);
                      }}
                    />
                  ))}
                </div>

                {revealed ? (
                  <div className="mt-4">
                    <Explanation title={t('result.explanation')}>
                      {item.question.explanation}
                    </Explanation>
                  </div>
                ) : null}
              </>
            ) : item.term ? (
              <>
                <p className="mb-3 text-xs font-medium" style={{ color: 'var(--text-subtle)' }}>
                  {t('glossary.title')}
                </p>

                <p className="text-xl font-semibold leading-snug">
                  {locale === 'nl' ? item.term.termNl : item.term.termEn}
                </p>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-subtle)' }}>
                  {locale === 'nl' ? item.term.termEn : item.term.termNl}
                </p>

                {revealed ? (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm leading-relaxed">{item.term.definition}</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                      {item.term.definitionAlt}
                    </p>
                    {item.term.note ? (
                      <Explanation title={t('common.source')}>{item.term.note}</Explanation>
                    ) : null}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="p115-btn p115-btn-secondary mt-5 w-full"
                    onClick={() => setRevealed(true)}
                  >
                    {t('review.showAnswer')}
                  </button>
                )}
              </>
            ) : null}
          </Card>

          {revealed ? (
            <>
              <p className="mt-5 px-1 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-subtle)' }}>
                {t('review.rate')}
              </p>

              <div className="mt-2 grid grid-cols-4 gap-2">
                {RATINGS.map((rating) => {
                  const seconds = intervals ? intervals[rating.value] : null;
                  return (
                    <button
                      key={rating.value}
                      type="button"
                      className="p115-btn p115-btn-secondary flex-col gap-0.5 px-1 py-2.5"
                      onClick={() => void rate(rating.value)}
                      disabled={busy}
                      style={{ borderColor: `var(--${rating.tone})` }}
                    >
                      <span className="text-[0.8125rem]" style={{ color: `var(--${rating.tone})` }}>
                        {t(rating.key)}
                      </span>
                      <span className="text-[0.6875rem] tabular-nums" style={{ color: 'var(--text-subtle)' }}>
                        {seconds === null ? '—' : formatInterval(seconds, locale)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="p115-btn p115-btn-ghost mt-3 w-full text-xs"
                onClick={() => void suspend()}
                disabled={busy}
              >
                {t('review.suspend')}
              </button>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
