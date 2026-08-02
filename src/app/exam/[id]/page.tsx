import { redirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { requireUser } from '@/lib/auth/session';
import { loadAttempt } from '@/lib/exam/load';
import { getTranslator } from '@/lib/i18n';
import { ExamRunner } from '@/components/exam-runner';

export const metadata: Metadata = { title: 'Proefexamen' };

/**
 * Het lopende examen.
 *
 * Deze route staat bewust buiten de `(app)`-groep: tijdens een examen is er
 * geen navigatiebalk, precies zoals in de echte examenomgeving. Weglopen kan
 * alleen door in te leveren.
 */
export default async function ExamAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireUser();
  if (!session) redirect('/login');

  const attempt = await loadAttempt(id, session.user.id);
  if (!attempt) notFound();

  if (attempt.finishedAt !== null) redirect(`/result/${id}`);
  if (attempt.mode !== 'exam') redirect(`/practice/${id}`);

  const t = getTranslator(attempt.locale);

  return (
    <div className="min-h-dvh" style={{ background: 'var(--surface-sunken)' }}>
      <div
        className="border-b px-4 py-2.5 text-center text-sm font-medium"
        style={{ background: 'var(--surface-raised)', borderColor: 'var(--border)' }}
      >
        {attempt.certificationTitle}
        {attempt.extraTimeApplied ? (
          <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            (+25%)
          </span>
        ) : null}
      </div>

      <ExamRunner
        attempt={attempt}
        labels={{
          question: t('exam.question'),
          of: t('exam.of'),
          next: t('exam.next'),
          previous: t('exam.previous'),
          flag: t('exam.flag'),
          flagged: t('exam.flagged'),
          submit: t('exam.submit'),
          submitConfirm: t('exam.submitConfirm'),
          timeLeft: t('exam.timeLeft'),
          unanswered: t('exam.unanswered'),
          answered: t('exam.answered'),
          overview: t('exam.overview'),
          timeUp: t('exam.timeUp'),
          showAlt:
            attempt.locale === 'nl' ? t('common.showInEnglish') : t('common.showInDutch'),
        }}
      />
    </div>
  );
}
