import Link from 'next/link';
import type { Metadata } from 'next';

import { requireUser } from '@/lib/auth/session';
import { getTranslator } from '@/lib/i18n';
import { getReviewQueue } from '@/app/actions/review';
import { ReviewRunner } from '@/components/review-runner';
import { PageHeading, EmptyState } from '@/components/ui';

export const metadata: Metadata = { title: 'Herhalen' };

// De wachtrij verandert bij elke beoordeling; cachen zou verouderde kaarten tonen.
export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  const session = await requireUser();
  if (!session) return null;

  const t = getTranslator(session.user.locale);
  const items = await getReviewQueue(session.user.locale, 30);

  if (items.length === 0) {
    return (
      <>
        <PageHeading title={t('review.title')} />
        <EmptyState
          title={t('review.noneDue')}
          description="Herhalingen worden gepland met FSRS: je ziet een vraag terug op het moment dat je hem bijna zou vergeten."
          action={
            <div className="flex gap-2">
              <Link href="/practice" className="p115-btn p115-btn-primary text-sm">
                {t('nav.practice')}
              </Link>
              <Link href="/glossary" className="p115-btn p115-btn-secondary text-sm">
                {t('nav.glossary')}
              </Link>
            </div>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeading
        title={t('review.title')}
        subtitle={`${items.length} ${t('dashboard.cards')} ${t('review.due').toLowerCase()}`}
      />
      <ReviewRunner
        items={items}
        labels={{
          again: t('review.again'),
          hard: t('review.hard'),
          good: t('review.good'),
          easy: t('review.easy'),
          showAnswer: t('review.showAnswer'),
          explanation: t('result.explanation'),
          correct: t('result.correct'),
          incorrect: t('result.incorrect'),
          done: t('review.noneDue'),
          remaining: t('common.close'),
        }}
      />
    </>
  );
}
