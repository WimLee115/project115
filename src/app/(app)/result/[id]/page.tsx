import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { requireUser } from '@/lib/auth/session';
import { loadAttempt, type LoadedQuestion } from '@/lib/exam/load';
import { getTranslator } from '@/lib/i18n';
import { Card, PageHeading, Badge, ProgressBar, ScoreRing, Stat } from '@/components/ui';

export const metadata: Metadata = { title: 'Examenrapport' };

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

/** Eén nagekeken vraag, met het juiste antwoord en de rationale per optie. */
function ReviewedQuestion({
  question,
  index,
  labels,
}: {
  question: LoadedQuestion;
  index: number;
  labels: {
    correct: string;
    incorrect: string;
    notAnswered: string;
    explanation: string;
    objective: string;
    source: string;
  };
}) {
  const answered = question.selectedOptionId !== null;
  const correct = question.isCorrect === true;

  return (
    <Card as="article">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold tabular-nums">{index + 1}.</span>
        {!answered ? (
          <Badge tone="warning">{labels.notAnswered}</Badge>
        ) : correct ? (
          <Badge tone="success">{labels.correct}</Badge>
        ) : (
          <Badge tone="danger">{labels.incorrect}</Badge>
        )}
        <span className="ml-auto text-xs" style={{ color: 'var(--text-subtle)' }}>
          {labels.objective} {question.objectiveCode}
        </span>
      </div>

      <p className="whitespace-pre-line text-[0.9375rem] leading-relaxed">{question.stem}</p>

      {question.listItems ? (
        <ol className="mt-3 space-y-1 text-sm">
          {question.listItems.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>
                {i + 1}.
              </span>
              <span>{item.text}</span>
            </li>
          ))}
        </ol>
      ) : null}

      <ul className="mt-4 space-y-2">
        {question.options.map((option) => {
          const chosen = question.selectedOptionId === option.id;
          const isRight = option.isCorrect === true;
          const state = isRight ? 'correct' : chosen ? 'incorrect' : undefined;

          return (
            <li key={option.id} className="p115-option cursor-default" data-state={state}>
              <span className="p115-option-label" aria-hidden="true">
                {option.label}
              </span>
              <span className="pt-0.5 text-sm leading-relaxed">
                {option.text}
                {chosen ? (
                  <span className="ml-1.5 text-xs font-semibold" style={{ opacity: 0.75 }}>
                    &larr; jouw antwoord
                  </span>
                ) : null}
                {option.rationale && !isRight ? (
                  <span className="mt-1 block text-xs" style={{ color: 'var(--text-muted)' }}>
                    {option.rationale}
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>

      {question.explanation ? (
        <div
          className="mt-4 rounded-lg p-3.5 text-sm leading-relaxed"
          style={{ background: 'var(--info-soft)', color: 'var(--text)' }}
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--info)' }}>
            {labels.explanation}
          </p>
          {question.explanation}
          {question.sourceRef ? (
            <p className="mt-2 text-xs" style={{ color: 'var(--text-subtle)' }}>
              {labels.source}: {question.sourceRef}
            </p>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireUser();
  if (!session) redirect('/login');

  const attempt = await loadAttempt(id, session.user.id, { includeAnswers: true });
  if (!attempt) notFound();
  if (attempt.finishedAt === null) {
    redirect(attempt.mode === 'exam' ? `/exam/${id}` : `/practice/${id}`);
  }

  const t = getTranslator(attempt.locale);

  const score = attempt.score ?? 0;
  const total = attempt.questionCount;
  const passed = attempt.passed === true;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const duration = attempt.finishedAt - attempt.startedAt;

  // Score per examengebied: hier zie je waar het misging, niet alleen dát het misging.
  const byDomain = new Map<
    string,
    { title: string; correct: number; total: number }
  >();
  for (const question of attempt.questions) {
    const entry = byDomain.get(question.domainCode) ?? {
      title: question.domainTitle,
      correct: 0,
      total: 0,
    };
    entry.total += 1;
    if (question.isCorrect === true) entry.correct += 1;
    byDomain.set(question.domainCode, entry);
  }

  const domainRows = [...byDomain.entries()].sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
      <PageHeading
        title={t('result.title')}
        subtitle={attempt.certificationTitle}
        actions={
          <Link href="/dashboard" className="p115-btn p115-btn-secondary text-sm p115-no-print">
            {t('nav.dashboard')}
          </Link>
        }
      />

      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-8">
          <ScoreRing
            value={percentage}
            label={`${score}/${total}`}
            sublabel={`${percentage}%`}
            tone={passed ? 'success' : 'danger'}
          />

          <div className="flex-1 space-y-4">
            <div>
              {passed ? (
                <Badge tone="success">{t('result.passed')}</Badge>
              ) : (
                <Badge tone="danger">{t('result.failed')}</Badge>
              )}
              {attempt.autoSubmitted ? (
                <p className="mt-2 text-xs" style={{ color: 'var(--warning)' }}>
                  {t('result.autoSubmitted')}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              <Stat label={t('result.score')} value={`${score} / ${total}`} />
              <Stat
                label={t('result.passMark')}
                value={`${attempt.passMark} / ${total}`}
                hint={`${Math.round((attempt.passMark / total) * 100)}%`}
              />
              <Stat label={t('result.timeUsed')} value={formatDuration(duration)} />
            </div>

            <div>
              <ProgressBar
                value={score}
                max={total}
                threshold={attempt.passMark}
                tone={passed ? 'success' : 'danger'}
                height={10}
                label={t('result.score')}
              />
              <p className="mt-1.5 text-xs" style={{ color: 'var(--text-subtle)' }}>
                De streep markeert de cesuur ({attempt.passMark} goed).
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-4 text-sm font-semibold">{t('result.byDomain')}</h2>
        <div className="space-y-3.5">
          {domainRows.map(([code, data]) => {
            const ratio = data.total > 0 ? data.correct / data.total : 0;
            const tone = ratio >= 0.65 ? 'success' : ratio >= 0.5 ? 'warning' : 'danger';
            return (
              <div key={code}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                  <span>
                    <span className="font-medium tabular-nums">{code}.</span> {data.title}
                  </span>
                  <span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>
                    {data.correct}/{data.total}
                  </span>
                </div>
                <ProgressBar
                  value={data.correct}
                  max={data.total}
                  tone={tone}
                  threshold={data.total * 0.65}
                  height={6}
                />
              </div>
            );
          })}
        </div>
      </Card>

      <h2 className="mb-4 text-sm font-semibold">{t('result.review')}</h2>
      <div className="space-y-4">
        {attempt.questions.map((question, index) => (
          <ReviewedQuestion
            key={question.questionId}
            question={question}
            index={index}
            labels={{
              correct: t('result.correct'),
              incorrect: t('result.incorrect'),
              notAnswered: t('result.notAnswered'),
              explanation: t('result.explanation'),
              objective: t('common.objective'),
              source: t('common.source'),
            }}
          />
        ))}
      </div>
    </>
  );
}
