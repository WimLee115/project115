import { useEffect, useRef, useState } from 'react';

import { useApp } from '@/app/app-state';
import { Explanation, OptionButton, QuestionStem } from '@/components/question';
import { Badge, ErrorNote, Loading, ProgressBar, TopBar } from '@/components/ui';
import {
  loadAttempt,
  saveAnswer,
  submitAttempt,
  type LoadedAttempt,
  type LoadedQuestion,
} from '@/lib/exam';
import { failure as buzz, success as ping } from '@/lib/haptics';
import { useRouter } from '@/lib/router';
import { useAsync } from '@/lib/use-async';

/**
 * Oefensessie.
 *
 * Het tegenovergestelde van het proefexamen: hier is elke fout meteen een les.
 * Na het nakijken staat er niet alleen wat goed was, maar ook waaróm de andere
 * opties niet kloppen — dat is waar het begrip zit, en het is precies wat je op
 * je examendag niet meer kunt opzoeken.
 *
 * Elk nagekeken antwoord gaat automatisch het herhaalschema in: fout betekent
 * 'opnieuw', goed betekent 'gelukt'. Zo groeit je herhaalwachtrij vanzelf uit
 * wat je oefent.
 */

export function PracticeScreen({ attemptId }: { attemptId: string }) {
  const { t } = useApp();
  const { navigate } = useRouter();
  const { data, error, loading, reload } = useAsync(
    () => loadAttempt(attemptId),
    [attemptId],
  );

  useEffect(() => {
    if (data && data.finishedAt !== null) {
      navigate(`/result/${attemptId}`, { replace: true });
    }
  }, [data, attemptId, navigate]);

  if (loading) return <Loading label={t('common.loading')} />;

  if (error || !data) {
    return (
      <div className="pt-5">
        <TopBar title={t('practice.title')} onBack={() => navigate('/')} />
        <ErrorNote
          message={t('common.error')}
          onRetry={reload}
          retryLabel={t('common.confirm')}
        />
      </div>
    );
  }

  if (data.finishedAt !== null) return <Loading />;

  return <PracticeRunner attempt={data} />;
}

function PracticeRunner({ attempt }: { attempt: LoadedAttempt }) {
  const { t, locale, refreshDue } = useApp();
  const { navigate } = useRouter();

  const total = attempt.questions.length;

  const [index, setIndex] = useState(() => {
    const first = attempt.questions.findIndex((row) => row.selectedOptionId === null);
    return first === -1 ? 0 : first;
  });

  const [answers, setAnswers] = useState<Record<number, string | null>>(() =>
    Object.fromEntries(attempt.questions.map((row) => [row.position, row.selectedOptionId])),
  );
  // Nagekeken vragen tonen het juiste antwoord; een vraag die je al eerder
  // beantwoordde staat dus meteen open.
  const [checked, setChecked] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(
      attempt.questions.map((row) => [row.position, row.selectedOptionId !== null]),
    ),
  );

  const [showAlt, setShowAlt] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const enteredAt = useRef(Date.now());
  const finished = useRef(false);

  const question = attempt.questions[index];
  const selected = question ? (answers[question.position] ?? null) : null;
  const isChecked = question ? checked[question.position] === true : false;

  useEffect(() => {
    enteredAt.current = Date.now();
    setShowAlt(false);
    setNotice(null);
  }, [index]);

  const check = async () => {
    if (!question || selected === null || isChecked) return;

    setBusy(true);
    const spent = Date.now() - enteredAt.current;

    const result = await saveAnswer({
      attemptId: attempt.id,
      position: question.position,
      optionId: selected,
      timeSpentMs: spent,
    });

    setBusy(false);

    if (!result.ok) {
      setNotice(result.error ?? t('common.error'));
      return;
    }

    setChecked((current) => ({ ...current, [question.position]: true }));
    void (result.feedback?.correct ? ping() : buzz());
    void refreshDue();
  };

  const finish = async () => {
    if (finished.current) return;
    finished.current = true;
    setBusy(true);

    await submitAttempt(attempt.id, false);
    await refreshDue();
    navigate(`/result/${attempt.id}`, { replace: true });
  };

  const correctSoFar = attempt.questions.filter(
    (row) =>
      checked[row.position] === true &&
      row.options.some((option) => option.isCorrect && option.id === answers[row.position]),
  ).length;

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const isLast = index >= total - 1;

  return (
    <div className="pt-1">
      <TopBar
        title={`${t('exam.question')} ${index + 1} ${t('exam.of')} ${total}`}
        subtitle={attempt.certificationTitle}
        onBack={() => navigate('/', { replace: true })}
        action={
          checkedCount > 0 ? (
            <Badge tone={correctSoFar >= checkedCount * 0.65 ? 'success' : 'warning'}>
              {correctSoFar}/{checkedCount}
            </Badge>
          ) : null
        }
      />

      <ProgressBar
        value={index + 1}
        max={Math.max(1, total)}
        height={4}
        label={t('practice.title')}
      />

      {question ? (
        <>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xs font-medium" style={{ color: 'var(--text-subtle)' }}>
              {t('common.objective')} {question.objectiveCode}
            </span>
            <button
              type="button"
              className="text-xs underline underline-offset-2"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => setShowAlt((value) => !value)}
            >
              {locale === 'nl' ? t('common.showInEnglish') : t('common.showInDutch')}
            </button>
          </div>

          <div className="mt-3">
            <QuestionStem
              stem={question.stem}
              stemAlt={question.stemAlt}
              {...(question.listItems ? { listItems: question.listItems } : {})}
              showAlt={showAlt}
            />
          </div>

          <div className="mt-5 space-y-2.5">
            {question.options.map((option) => (
              <OptionButton
                key={option.id}
                label={option.label}
                text={option.text}
                textAlt={option.textAlt}
                showAlt={showAlt}
                selected={!isChecked && selected === option.id}
                state={optionState(option, selected, isChecked)}
                disabled={isChecked}
                footnote={isChecked ? option.rationale : null}
                onClick={() => {
                  if (isChecked) return;
                  setAnswers((current) => ({ ...current, [question.position]: option.id }));
                }}
              />
            ))}
          </div>

          {isChecked ? (
            <div className="mt-5">
              <Explanation
                title={t('result.explanation')}
                sourceRef={question.sourceRef}
                sourceLabel={t('common.source')}
              >
                {question.explanation}
              </Explanation>
            </div>
          ) : null}

          {notice ? (
            <div className="mt-4">
              <ErrorNote message={notice} />
            </div>
          ) : null}
        </>
      ) : (
        <ErrorNote message={t('common.error')} />
      )}

      <div className="p115-actionbar">
        {!isChecked ? (
          <button
            type="button"
            className="p115-btn p115-btn-primary flex-1"
            onClick={() => void check()}
            disabled={selected === null || busy}
          >
            {t('practice.checkAnswer')}
          </button>
        ) : isLast ? (
          <button
            type="button"
            className="p115-btn p115-btn-primary flex-1"
            onClick={() => void finish()}
            disabled={busy}
          >
            {t('practice.finish')}
          </button>
        ) : (
          <button
            type="button"
            className="p115-btn p115-btn-primary flex-1"
            onClick={() => setIndex((value) => Math.min(total - 1, value + 1))}
          >
            {t('practice.continue')}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Kleurt een optie pas nadat er is nagekeken.
 *
 * Het juiste antwoord kleurt altijd groen, ook als je het niet koos: weten wat
 * je had moeten kiezen is de helft van de les.
 */
function optionState(
  option: LoadedQuestion['options'][number],
  selected: string | null,
  isChecked: boolean,
): 'correct' | 'incorrect' | null {
  if (!isChecked) return null;
  if (option.isCorrect) return 'correct';
  if (option.id === selected) return 'incorrect';
  return null;
}
