import { redirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { requireUser } from '@/lib/auth/session';
import { loadAttempt } from '@/lib/exam/load';
import { getTranslator } from '@/lib/i18n';
import { PracticeRunner } from '@/components/practice-runner';

export const metadata: Metadata = { title: 'Oefenen' };

export default async function PracticeAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireUser();
  if (!session) redirect('/login');

  const attempt = await loadAttempt(id, session.user.id, { includeAnswers: false });
  if (!attempt) notFound();
  if (attempt.finishedAt !== null) redirect(`/result/${id}`);
  if (attempt.mode === 'exam') redirect(`/exam/${id}`);

  const t = getTranslator(attempt.locale);

  return (
    <PracticeRunner
      attempt={attempt}
      labels={{
        question: t('exam.question'),
        of: t('exam.of'),
        check: t('practice.checkAnswer'),
        continue: t('practice.continue'),
        finish: t('practice.finish'),
        explanation: t('result.explanation'),
        correct: t('result.correct'),
        incorrect: t('result.incorrect'),
        objective: t('common.objective'),
        source: t('common.source'),
        showAlt:
          attempt.locale === 'nl' ? t('common.showInEnglish') : t('common.showInDutch'),
      }}
    />
  );
}
