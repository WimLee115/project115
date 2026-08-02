import 'server-only';

import { db } from '@/db';
import { auditLog } from '@/db/schema';
import { hashIp } from '@/lib/crypto';
import { getClientIp, getUserAgent } from '@/lib/auth/session';

/**
 * Auditlog voor beveiligingsrelevante gebeurtenissen.
 *
 * Het logboek is append-only en bevat nooit wachtwoorden, tokens of TOTP-codes.
 * Wat er wél in staat, is genoeg om achteraf te zien of iemand anders heeft
 * geprobeerd binnen te komen.
 */

export type AuditEvent =
  | 'auth.login'
  | 'auth.logout'
  | 'auth.login_blocked'
  | 'auth.mfa_challenge'
  | 'auth.mfa_verify'
  | 'auth.mfa_enabled'
  | 'auth.mfa_disabled'
  | 'auth.password_changed'
  | 'auth.account_created'
  | 'auth.account_locked'
  | 'auth.recovery_used'
  | 'exam.started'
  | 'exam.submitted'
  | 'exam.abandoned'
  | 'data.exported'
  | 'data.deleted'
  | 'settings.updated';

export async function record(
  event: AuditEvent,
  outcome: 'success' | 'failure',
  options: {
    userId?: string | null;
    meta?: Record<string, unknown>;
  } = {},
): Promise<void> {
  try {
    const [ip, userAgent] = await Promise.all([getClientIp(), getUserAgent()]);

    await db.insert(auditLog).values({
      userId: options.userId ?? null,
      event,
      outcome,
      ipHash: hashIp(ip),
      userAgent,
      meta: options.meta ? JSON.stringify(options.meta) : null,
    });
  } catch (error) {
    // Een falend auditlog mag de gebruikersactie nooit blokkeren, maar moet
    // wel zichtbaar zijn in de serverlogs.
    console.error('[audit] kon gebeurtenis niet vastleggen:', event, error);
  }
}
