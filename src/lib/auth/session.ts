import 'server-only';

import { cookies, headers } from 'next/headers';
import { eq, and, lt, gt } from 'drizzle-orm';
import { cache } from 'react';

import { db } from '@/db';
import { sessions, users, type User } from '@/db/schema';
import { generateToken, sha256, hashIp, newId } from '@/lib/crypto';

/**
 * Sessiebeheer.
 *
 * Ontwerp:
 * - Het token staat alleen in een httpOnly-cookie. In de database bewaren we
 *   uitsluitend de SHA-256 ervan, zodat een databaselek geen sessieovername
 *   mogelijk maakt.
 * - Twee vervaltermijnen: een glijdende (inactiviteit) en een absolute. De
 *   absolute wordt nooit verlengd, dus een gestolen sessie verloopt sowieso.
 */

/**
 * De `__Host-`-prefix is de strengste cookievariant: de browser accepteert hem
 * alleen met Secure, Path=/ en zonder Domain, waardoor een subdomein de cookie
 * niet kan overschrijven. Dat vereist HTTPS, wat in productie (achter Caddy)
 * altijd het geval is. In development draait de app op http://localhost en zou
 * de browser de cookie weigeren; daar gebruiken we daarom de gewone naam.
 */
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const SESSION_COOKIE = IS_PRODUCTION
  ? '__Host-p115_session'
  : 'p115_session';

/** Verlenging bij activiteit: 7 dagen. */
const IDLE_TTL_SECONDS = 60 * 60 * 24 * 7;
/** Harde bovengrens: 30 dagen. */
const ABSOLUTE_TTL_SECONDS = 60 * 60 * 24 * 30;
/** Pas verlengen als meer dan een dag verstreken is (bespaart schrijfacties). */
const RENEW_THRESHOLD_SECONDS = 60 * 60 * 24;

export interface SessionContext {
  user: User;
  sessionId: string;
  mfaSatisfied: boolean;
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/** Leest het client-IP uit de proxy-headers die Caddy zet. */
export async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) {
    // Eerste adres is de oorspronkelijke client.
    return forwarded.split(',')[0]?.trim() ?? null;
  }
  return h.get('x-real-ip');
}

export async function getUserAgent(): Promise<string | null> {
  const h = await headers();
  return h.get('user-agent')?.slice(0, 255) ?? null;
}

/**
 * Maakt een sessie aan en zet de cookie.
 *
 * @param mfaSatisfied false zolang de tweede factor nog moet worden ingevuld.
 */
export async function createSession(
  userId: string,
  options: { mfaSatisfied?: boolean } = {},
): Promise<string> {
  const token = generateToken(32);
  const tokenHash = sha256(token);
  const ts = nowSeconds();

  const [ip, userAgent] = await Promise.all([getClientIp(), getUserAgent()]);

  await db.insert(sessions).values({
    id: tokenHash,
    userId,
    expiresAt: ts + IDLE_TTL_SECONDS,
    absoluteExpiresAt: ts + ABSOLUTE_TTL_SECONDS,
    ipHash: hashIp(ip),
    userAgent,
    mfaSatisfied: options.mfaSatisfied ?? true,
    createdAt: ts,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    // Lax blokkeert de cookie bij cross-site POSTs en dekt daarmee het
    // grootste deel van het CSRF-oppervlak af; Server Actions controleren
    // daarnaast zelf de Origin-header.
    sameSite: 'lax',
    path: '/',
    maxAge: ABSOLUTE_TTL_SECONDS,
  });

  return tokenHash;
}

/**
 * Haalt de huidige sessie op en verlengt hem indien nodig.
 *
 * Met `cache()` gebeurt dit maximaal één keer per request, ook als meerdere
 * server components de sessie opvragen.
 */
export const getSession = cache(async (): Promise<SessionContext | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = sha256(token);
  const ts = nowSeconds();

  const rows = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.id, tokenHash),
        gt(sessions.expiresAt, ts),
        gt(sessions.absoluteExpiresAt, ts),
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  // Glijdende verlenging, begrensd door de absolute vervaldatum.
  const remaining = row.session.expiresAt - ts;
  if (remaining < IDLE_TTL_SECONDS - RENEW_THRESHOLD_SECONDS) {
    const extended = Math.min(
      ts + IDLE_TTL_SECONDS,
      row.session.absoluteExpiresAt,
    );
    await db
      .update(sessions)
      .set({ expiresAt: extended })
      .where(eq(sessions.id, tokenHash));
  }

  return {
    user: row.user,
    sessionId: row.session.id,
    mfaSatisfied: row.session.mfaSatisfied,
  };
});

/** Markeert de sessie als volledig geauthenticeerd na een geslaagde 2FA. */
export async function markMfaSatisfied(sessionId: string): Promise<void> {
  await db
    .update(sessions)
    .set({ mfaSatisfied: true })
    .where(eq(sessions.id, sessionId));
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await db.delete(sessions).where(eq(sessions.id, sha256(token)));
  }
  cookieStore.delete(SESSION_COOKIE);
}

/** Verwijdert alle sessies van een gebruiker (bijv. na wachtwoordwijziging). */
export async function destroyAllSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

/** Ruimt verlopen sessies op. Wordt bij het inloggen aangeroepen. */
export async function pruneExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(lt(sessions.absoluteExpiresAt, nowSeconds()));
}

/**
 * Vereist een ingelogde, volledig geauthenticeerde gebruiker.
 * Retourneert null als dat niet zo is; de aanroeper bepaalt de redirect.
 */
export async function requireUser(): Promise<SessionContext | null> {
  const session = await getSession();
  if (!session || !session.mfaSatisfied) return null;
  return session;
}

export { newId };
