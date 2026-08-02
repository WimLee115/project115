'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { eq, and, inArray, isNull, desc } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import {
  attempts,
  attemptQuestions,
  certifications,
  questionOptions,
  studyPlans,
} from '@/db/schema';
import { requireUser } from '@/lib/auth/session';
import { generateExam, getRecentlySeenQuestionIds } from '@/lib/exam/generate';
import { getWeakObjectiveIds } from '@/lib/stats';
import { recordAnswerAsReview } from '@/lib/srs';
import { record } from '@/lib/security/audit';
import { consume } from '@/lib/security/rate-limit';
import { newId } from '@/lib/crypto';

/**
 * Acties rond proefexamens, oefensessies en het nakijken daarvan.
 *
 * Belangrijk verschil met de oefenmodus: in examenmodus geeft de server geen
 * enkele terugkoppeling over juistheid vóór het inleveren. Het antwoord wordt
 * opgeslagen, meer niet. Zo kan de client ook niet per ongeluk het juiste
 * antwoord in beeld krijgen.
 */

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

const startSchema = z.object({
  certificationId: z.string().min(1).max(64),
  mode: z.enum(['exam', 'practice', 'weakspot', 'review']),
  locale: z.enum(['nl', 'en']),
  extraTime: z.coerce.boolean().default(false),
  count: z.coerce.number().int().min(1).max(200).optional(),
});

export async function startAttempt(formData: FormData): Promise<void> {
  const session = await requireUser();
  if (!session) redirect('/login');

  const limit = await consume('write', session.user.id);
  if (!limit.allowed) throw new Error('Te veel verzoeken. Probeer het zo opnieuw.');

  const parsed = startSchema.safeParse({
    certificationId: formData.get('certificationId'),
    mode: formData.get('mode'),
    locale: formData.get('locale') ?? session.user.locale,
    extraTime: formData.get('extraTime') === 'on' || formData.get('extraTime') === 'true',
    count: formData.get('count') ?? undefined,
  });

  if (!parsed.success) throw new Error('Ongeldige invoer.');
  const { certificationId, mode, locale, extraTime, count } = parsed.data;

  const certRows = await db
    .select()
    .from(certifications)
    .where(eq(certifications.id, certificationId))
    .limit(1);
  const cert = certRows[0];
  if (!cert) throw new Error('Onbekende certificering.');

  // Een lopende poging voor dezelfde certificering hervatten in plaats van een
  // tweede te starten: anders raak je je voortgang kwijt door een verkeerde klik.
  const openRows = await db
    .select({ id: attempts.id })
    .from(attempts)
    .where(
      and(
        eq(attempts.userId, session.user.id),
        eq(attempts.certificationId, certificationId),
        isNull(attempts.finishedAt),
      ),
    )
    .orderBy(desc(attempts.startedAt))
    .limit(1);

  const open = openRows[0];
  if (open) redirect(`/exam/${open.id}`);

  const questionCount =
    count ?? (mode === 'exam' ? cert.questionCount : Math.min(20, cert.questionCount));

  let objectiveIds: string[] | undefined;
  if (mode === 'weakspot') {
    const weak = await getWeakObjectiveIds(session.user.id, certificationId);
    objectiveIds = weak.length > 0 ? weak : undefined;
  }

  const recentlySeen =
    mode === 'exam'
      ? await getRecentlySeenQuestionIds(session.user.id, certificationId)
      : [];

  const generated = await generateExam({
    certificationId,
    count: questionCount,
    excludeQuestionIds: recentlySeen,
    ...(objectiveIds ? { objectiveIds } : {}),
  });

  if (generated.length === 0) throw new Error('Geen vragen beschikbaar.');

  const timeLimitSeconds =
    mode === 'exam'
      ? (cert.durationMinutes + (extraTime ? cert.extraTimeMinutes : 0)) * 60
      : null;

  const attemptId = newId('att');

  await db.insert(attempts).values({
    id: attemptId,
    userId: session.user.id,
    certificationId,
    mode,
    locale,
    startedAt: nowSeconds(),
    timeLimitSeconds,
    extraTimeApplied: mode === 'exam' && extraTime,
    questionCount: generated.length,
    passMark:
      mode === 'exam'
        ? cert.passMark
        : // Bij kortere sessies de cesuur naar rato meeschalen.
          Math.ceil((cert.passMark / cert.questionCount) * generated.length),
  });

  await db.insert(attemptQuestions).values(
    generated.map((item, index) => ({
      id: newId('aq'),
      attemptId,
      questionId: item.questionId,
      objectiveId: item.objectiveId,
      position: index,
      optionOrder: JSON.stringify(item.optionOrder),
    })),
  );

  await record('exam.started', 'success', {
    userId: session.user.id,
    meta: { certificationId, mode, questionCount: generated.length },
  });

  redirect(mode === 'exam' ? `/exam/${attemptId}` : `/practice/${attemptId}`);
}

const answerSchema = z.object({
  attemptId: z.string().min(1).max(64),
  position: z.coerce.number().int().min(0).max(500),
  optionId: z.string().min(1).max(64).nullable(),
  timeSpentMs: z.coerce.number().int().min(0).max(3_600_000).default(0),
});

export interface AnswerResult {
  ok: boolean;
  error?: string;
  /** Alleen gevuld in oefenmodus; in examenmodus bewust weggelaten. */
  feedback?: {
    correct: boolean;
    correctOptionId: string;
    explanation: string;
    rationales: Record<string, string | null>;
  };
}

/**
 * Slaat een antwoord op.
 *
 * In oefenmodus komt de feedback direct terug; in examenmodus niet. De
 * beslissing daarover ligt bewust op de server, zodat de client er niet
 * omheen kan werken.
 */
export async function saveAnswer(input: {
  attemptId: string;
  position: number;
  optionId: string | null;
  timeSpentMs?: number;
}): Promise<AnswerResult> {
  const session = await requireUser();
  if (!session) return { ok: false, error: 'Niet ingelogd.' };

  const parsed = answerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Ongeldige invoer.' };

  const { attemptId, position, optionId, timeSpentMs } = parsed.data;

  const rows = await db
    .select({ attempt: attempts, item: attemptQuestions })
    .from(attempts)
    .innerJoin(attemptQuestions, eq(attemptQuestions.attemptId, attempts.id))
    .where(
      and(
        eq(attempts.id, attemptId),
        // Voorkomt dat je met een geraden attempt-id in andermans poging schrijft.
        eq(attempts.userId, session.user.id),
        eq(attemptQuestions.position, position),
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row) return { ok: false, error: 'Vraag niet gevonden.' };
  if (row.attempt.finishedAt !== null) {
    return { ok: false, error: 'Deze poging is al afgerond.' };
  }

  // Verstreken tijd controleren: na de limiet worden geen antwoorden meer
  // geaccepteerd, ook niet als de client de timer negeert.
  if (row.attempt.timeLimitSeconds !== null) {
    const elapsed = nowSeconds() - row.attempt.startedAt;
    if (elapsed > row.attempt.timeLimitSeconds + 5) {
      return { ok: false, error: 'De tijd is verstreken.' };
    }
  }

  const options = await db
    .select()
    .from(questionOptions)
    .where(eq(questionOptions.questionId, row.item.questionId));

  const chosen = optionId ? options.find((o) => o.id === optionId) : null;
  if (optionId && !chosen) return { ok: false, error: 'Ongeldige antwoordoptie.' };

  const isCorrect = chosen ? chosen.isCorrect : null;

  await db
    .update(attemptQuestions)
    .set({
      selectedOptionId: optionId,
      isCorrect,
      timeSpentMs: row.item.timeSpentMs + timeSpentMs,
      answeredAt: optionId ? nowSeconds() : null,
    })
    .where(eq(attemptQuestions.id, row.item.id));

  if (row.attempt.mode === 'exam') {
    // Geen enkele terugkoppeling tijdens een proefexamen.
    return { ok: true };
  }

  // Oefenmodus: het antwoord telt direct mee voor het herhaalschema.
  if (optionId !== null && isCorrect !== null) {
    await recordAnswerAsReview(
      session.user.id,
      row.item.questionId,
      row.attempt.certificationId,
      isCorrect,
      timeSpentMs,
    );
  }

  const correctOption = options.find((o) => o.isCorrect);
  const locale = row.attempt.locale;

  const questionRows = await db.query.questions.findFirst({
    where: (q, { eq: equals }) => equals(q.id, row.item.questionId),
  });

  return {
    ok: true,
    feedback: {
      correct: isCorrect === true,
      correctOptionId: correctOption?.id ?? '',
      explanation:
        (locale === 'nl'
          ? questionRows?.explanationNl
          : questionRows?.explanationEn) ?? '',
      rationales: Object.fromEntries(
        options.map((o) => [o.id, locale === 'nl' ? o.rationaleNl : o.rationaleEn]),
      ),
    },
  };
}

export async function toggleFlag(input: {
  attemptId: string;
  position: number;
}): Promise<{ ok: boolean; flagged?: boolean }> {
  const session = await requireUser();
  if (!session) return { ok: false };

  const rows = await db
    .select({ item: attemptQuestions })
    .from(attempts)
    .innerJoin(attemptQuestions, eq(attemptQuestions.attemptId, attempts.id))
    .where(
      and(
        eq(attempts.id, input.attemptId),
        eq(attempts.userId, session.user.id),
        eq(attemptQuestions.position, input.position),
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row) return { ok: false };

  const flagged = !row.item.flagged;
  await db
    .update(attemptQuestions)
    .set({ flagged })
    .where(eq(attemptQuestions.id, row.item.id));

  return { ok: true, flagged };
}

/**
 * Levert een poging in en berekent de score.
 *
 * @param auto true wanneer de tijd verstreek in plaats van dat de gebruiker
 *             zelf inleverde; dat wordt apart vastgelegd omdat het iets zegt
 *             over je tempo.
 */
export async function submitAttempt(
  attemptId: string,
  auto = false,
): Promise<void> {
  const session = await requireUser();
  if (!session) redirect('/login');

  const rows = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, attemptId), eq(attempts.userId, session.user.id)))
    .limit(1);

  const attempt = rows[0];
  if (!attempt) throw new Error('Poging niet gevonden.');

  if (attempt.finishedAt !== null) {
    redirect(`/result/${attemptId}`);
  }

  const items = await db
    .select()
    .from(attemptQuestions)
    .where(eq(attemptQuestions.attemptId, attemptId));

  const score = items.filter((item) => item.isCorrect === true).length;
  const passed = score >= attempt.passMark;

  await db
    .update(attempts)
    .set({
      finishedAt: nowSeconds(),
      score,
      passed,
      autoSubmitted: auto,
    })
    .where(eq(attempts.id, attemptId));

  // Na een proefexamen alle antwoorden alsnog in het herhaalschema opnemen.
  // Tijdens het examen gebeurde dat bewust niet, om geen signaal te geven.
  if (attempt.mode === 'exam') {
    for (const item of items) {
      if (item.isCorrect === null) continue;
      await recordAnswerAsReview(
        session.user.id,
        item.questionId,
        attempt.certificationId,
        item.isCorrect,
        item.timeSpentMs,
      );
    }
  }

  await record('exam.submitted', 'success', {
    userId: session.user.id,
    meta: {
      attemptId,
      mode: attempt.mode,
      score,
      total: attempt.questionCount,
      passed,
      auto,
    },
  });

  revalidatePath('/dashboard');
  revalidatePath('/stats');
  redirect(`/result/${attemptId}`);
}

/** Breekt een lopende poging af zonder score, bijvoorbeeld bij een verkeerde start. */
export async function abandonAttempt(attemptId: string): Promise<void> {
  const session = await requireUser();
  if (!session) redirect('/login');

  const result = await db
    .delete(attempts)
    .where(
      and(
        eq(attempts.id, attemptId),
        eq(attempts.userId, session.user.id),
        isNull(attempts.finishedAt),
      ),
    );

  await record('exam.abandoned', 'success', {
    userId: session.user.id,
    meta: { attemptId, deleted: result.changes ?? 0 },
  });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

/* --- Studieplan -------------------------------------------------------- */

const planSchema = z.object({
  certificationId: z.string().min(1).max(64),
  examDate: z.string().optional(),
  dailyReviewTarget: z.coerce.number().int().min(5).max(200).optional(),
  useExtraTime: z.coerce.boolean().optional(),
  preferredLocale: z.enum(['nl', 'en']).optional(),
});

export async function updateStudyPlan(formData: FormData): Promise<void> {
  const session = await requireUser();
  if (!session) redirect('/login');

  const parsed = planSchema.safeParse({
    certificationId: formData.get('certificationId'),
    examDate: formData.get('examDate') ?? undefined,
    dailyReviewTarget: formData.get('dailyReviewTarget') ?? undefined,
    useExtraTime: formData.get('useExtraTime') === 'on',
    preferredLocale: formData.get('preferredLocale') ?? undefined,
  });

  if (!parsed.success) throw new Error('Ongeldige invoer.');

  const examDate =
    parsed.data.examDate && parsed.data.examDate.length > 0
      ? Math.floor(new Date(parsed.data.examDate).getTime() / 1000)
      : null;

  const existing = await db
    .select({ id: studyPlans.id })
    .from(studyPlans)
    .where(
      and(
        eq(studyPlans.userId, session.user.id),
        eq(studyPlans.certificationId, parsed.data.certificationId),
      ),
    )
    .limit(1);

  const values = {
    examDate,
    ...(parsed.data.dailyReviewTarget !== undefined
      ? { dailyReviewTarget: parsed.data.dailyReviewTarget }
      : {}),
    ...(parsed.data.useExtraTime !== undefined
      ? { useExtraTime: parsed.data.useExtraTime }
      : {}),
    ...(parsed.data.preferredLocale
      ? { preferredLocale: parsed.data.preferredLocale }
      : {}),
    updatedAt: nowSeconds(),
  };

  if (existing[0]) {
    await db.update(studyPlans).set(values).where(eq(studyPlans.id, existing[0].id));
  } else {
    await db.insert(studyPlans).values({
      id: newId('plan'),
      userId: session.user.id,
      certificationId: parsed.data.certificationId,
      ...values,
    });
  }

  await record('settings.updated', 'success', {
    userId: session.user.id,
    meta: { certificationId: parsed.data.certificationId },
  });

  revalidatePath('/dashboard');
  revalidatePath('/settings');
}

/** Ruimt lopende pogingen op die nooit zijn ingeleverd. */
export async function cleanupStaleAttempts(userId: string): Promise<void> {
  const stale = await db
    .select({ id: attempts.id, startedAt: attempts.startedAt, limit: attempts.timeLimitSeconds })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), isNull(attempts.finishedAt)));

  const expired = stale
    .filter((a) => a.limit !== null && nowSeconds() - a.startedAt > a.limit + 300)
    .map((a) => a.id);

  if (expired.length > 0) {
    for (const id of expired) {
      const items = await db
        .select()
        .from(attemptQuestions)
        .where(eq(attemptQuestions.attemptId, id));
      const score = items.filter((i) => i.isCorrect === true).length;
      const attemptRow = stale.find((a) => a.id === id);
      if (!attemptRow) continue;

      await db
        .update(attempts)
        .set({
          finishedAt: attemptRow.startedAt + (attemptRow.limit ?? 0),
          score,
          autoSubmitted: true,
        })
        .where(eq(attempts.id, id));
    }

    await db
      .update(attempts)
      .set({ passed: false })
      .where(and(inArray(attempts.id, expired), isNull(attempts.passed)));
  }
}
