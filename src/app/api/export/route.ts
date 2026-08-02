import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { attempts, attemptQuestions, fsrsCards, fsrsReviews, studyPlans } from '@/db/schema';
import { requireUser } from '@/lib/auth/session';
import { record } from '@/lib/security/audit';

/**
 * Exporteert alle studiegegevens van de ingelogde gebruiker als JSON.
 *
 * Bewust géén wachtwoordhash, sessietokens of TOTP-secret: dat zijn
 * inloggegevens, geen studiegegevens, en ze horen niet in een bestand dat
 * ergens in een downloadmap belandt.
 */
export async function GET() {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: 'Niet ingelogd.' }, { status: 401 });
  }

  const userId = session.user.id;

  const [attemptRows, plans, cards, reviews] = await Promise.all([
    db.select().from(attempts).where(eq(attempts.userId, userId)),
    db.select().from(studyPlans).where(eq(studyPlans.userId, userId)),
    db.select().from(fsrsCards).where(eq(fsrsCards.userId, userId)),
    db.select().from(fsrsReviews).where(eq(fsrsReviews.userId, userId)),
  ]);

  const answers = await Promise.all(
    attemptRows.map(async (attempt) => ({
      attemptId: attempt.id,
      items: await db
        .select()
        .from(attemptQuestions)
        .where(eq(attemptQuestions.attemptId, attempt.id)),
    })),
  );

  const payload = {
    exportedAt: new Date().toISOString(),
    application: 'Project115',
    author: 'B. van Rooij',
    user: {
      id: userId,
      email: session.user.email,
      displayName: session.user.displayName,
      locale: session.user.locale,
      createdAt: session.user.createdAt,
    },
    studyPlans: plans,
    attempts: attemptRows,
    answers,
    spacedRepetition: { cards, reviews },
  };

  await record('data.exported', 'success', { userId });

  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="project115-export-${stamp}.json"`,
      'Cache-Control': 'no-store',
    },
  });
}
