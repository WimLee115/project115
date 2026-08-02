import 'server-only';

import { eq, lt } from 'drizzle-orm';

import { db } from '@/db';
import { rateLimits } from '@/db/schema';
import { sha256 } from '@/lib/crypto';

/**
 * Rate limiting op basis van een vast venster, opgeslagen in SQLite.
 *
 * Bewust persistent en niet in het geheugen: bij een herstart zou een
 * in-memory teller de rem opheffen, precies op het moment dat een aanvaller
 * daar baat bij heeft.
 */

export interface RateLimitRule {
  /** Aantal toegestane pogingen binnen het venster. */
  limit: number;
  /** Venstergrootte in seconden. */
  windowSeconds: number;
  /** Hoe lang geblokkeerd blijft nadat het limiet is overschreden. */
  blockSeconds: number;
}

export const RULES = {
  /** Inloggen: streng, want dit is het doelwit van brute force. */
  login: { limit: 5, windowSeconds: 300, blockSeconds: 900 },
  /** Tweede factor: nog strenger, de zoekruimte is maar 6 cijfers. */
  totp: { limit: 5, windowSeconds: 300, blockSeconds: 900 },
  /** Accountaanmaak tijdens de eerste installatie. */
  register: { limit: 3, windowSeconds: 3600, blockSeconds: 3600 },
  /** Wachtwoord wijzigen. */
  passwordChange: { limit: 5, windowSeconds: 900, blockSeconds: 900 },
  /** Algemene schrijfacties, ruim genoeg voor normaal gebruik. */
  write: { limit: 240, windowSeconds: 60, blockSeconds: 60 },
} as const satisfies Record<string, RateLimitRule>;

export type RuleName = keyof typeof RULES;

export interface RateLimitResult {
  allowed: boolean;
  /** Resterende pogingen in dit venster. */
  remaining: number;
  /** Unix-seconden waarop de blokkade vervalt; alleen als allowed=false. */
  retryAt?: number;
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Registreert een poging en vertelt of die is toegestaan.
 *
 * @param rule    welke regel geldt
 * @param subject wat begrensd wordt (IP, e-mailadres, gebruikers-id)
 */
export async function consume(
  rule: RuleName,
  subject: string,
): Promise<RateLimitResult> {
  const config = RULES[rule];
  // Hashen zodat e-mailadressen en IP's niet leesbaar in de tabel staan.
  const key = `${rule}:${sha256(subject)}`;
  const ts = nowSeconds();

  const existing = await db
    .select()
    .from(rateLimits)
    .where(eq(rateLimits.key, key))
    .limit(1);

  const row = existing[0];

  if (!row) {
    await db.insert(rateLimits).values({ key, count: 1, windowStart: ts });
    return { allowed: true, remaining: config.limit - 1 };
  }

  if (row.blockedUntil && row.blockedUntil > ts) {
    return { allowed: false, remaining: 0, retryAt: row.blockedUntil };
  }

  // Venster verlopen: opnieuw beginnen.
  if (ts - row.windowStart >= config.windowSeconds) {
    await db
      .update(rateLimits)
      .set({ count: 1, windowStart: ts, blockedUntil: null })
      .where(eq(rateLimits.key, key));
    return { allowed: true, remaining: config.limit - 1 };
  }

  const nextCount = row.count + 1;

  if (nextCount > config.limit) {
    const blockedUntil = ts + config.blockSeconds;
    await db
      .update(rateLimits)
      .set({ count: nextCount, blockedUntil })
      .where(eq(rateLimits.key, key));
    return { allowed: false, remaining: 0, retryAt: blockedUntil };
  }

  await db
    .update(rateLimits)
    .set({ count: nextCount })
    .where(eq(rateLimits.key, key));

  return { allowed: true, remaining: config.limit - nextCount };
}

/** Wist de teller, bijvoorbeeld na een geslaagde login. */
export async function reset(rule: RuleName, subject: string): Promise<void> {
  await db.delete(rateLimits).where(eq(rateLimits.key, `${rule}:${sha256(subject)}`));
}

/** Ruimt oude vensters op zodat de tabel niet onbeperkt groeit. */
export async function prune(): Promise<void> {
  await db.delete(rateLimits).where(lt(rateLimits.windowStart, nowSeconds() - 86400));
}
