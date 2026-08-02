'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { TOTP, Secret } from 'otpauth';

import { db } from '@/db';
import { users, studyPlans } from '@/db/schema';
import { hashPassword, verifyPassword, checkPasswordStrength } from '@/lib/auth/password';
import {
  createSession,
  destroySession,
  destroyAllSessions,
  getSession,
  markMfaSatisfied,
  pruneExpiredSessions,
} from '@/lib/auth/session';
import { consume, reset } from '@/lib/security/rate-limit';
import { record } from '@/lib/security/audit';
import { newId, encrypt, decrypt, generateToken, sha256 } from '@/lib/crypto';
import { contentPacks } from '@content/index';

/**
 * Authenticatie-acties.
 *
 * Alle invoer gaat door Zod voordat er iets met de database gebeurt. Fouten
 * worden bewust generiek teruggegeven: het onderscheid tussen 'onbekend
 * e-mailadres' en 'verkeerd wachtwoord' vertelt een aanvaller welke accounts
 * bestaan.
 */

export interface ActionResult {
  ok: boolean;
  error?: string;
  /** Aanvullende status, bijvoorbeeld dat 2FA nog nodig is. */
  next?: 'mfa';
}

const emailSchema = z.string().trim().toLowerCase().email().max(254);
const passwordSchema = z.string().min(1).max(256);

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z.string().trim().min(1).max(80),
  locale: z.enum(['nl', 'en']).default('nl'),
});

/** Aantal mislukte pogingen waarna het account tijdelijk op slot gaat. */
const LOCK_THRESHOLD = 10;
const LOCK_DURATION_SECONDS = 900;

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/** True zolang er nog geen enkel account bestaat. */
export async function needsSetup(): Promise<boolean> {
  const rows = await db.select({ count: sql<number>`count(*)` }).from(users);
  return Number(rows[0]?.count ?? 0) === 0;
}

export async function register(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    displayName: formData.get('displayName'),
    locale: formData.get('locale') ?? 'nl',
  });

  if (!parsed.success) {
    return { ok: false, error: 'Controleer de ingevulde gegevens.' };
  }

  const { email, password, displayName, locale } = parsed.data;

  const limit = await consume('register', email);
  if (!limit.allowed) {
    await record('auth.account_created', 'failure', { meta: { reason: 'rate_limited' } });
    return { ok: false, error: 'Te veel pogingen. Probeer het later opnieuw.' };
  }

  // De hub is voor één gebruiker; een tweede registratie is geen scenario dat
  // we willen ondersteunen zonder expliciete uitnodiging.
  if (!(await needsSetup())) {
    return { ok: false, error: 'Er bestaat al een account. Log in.' };
  }

  const strength = checkPasswordStrength(password, { email, displayName });
  if (!strength.ok) {
    return { ok: false, error: strength.reason ?? 'Kies een sterker wachtwoord.' };
  }

  const userId = newId('usr');
  const passwordHash = await hashPassword(password);

  await db.insert(users).values({
    id: userId,
    email,
    passwordHash,
    displayName,
    locale,
  });

  // Standaard studieplan per certificering, zodat het dashboard direct werkt.
  for (const pack of contentPacks) {
    await db.insert(studyPlans).values({
      id: newId('plan'),
      userId,
      certificationId: pack.certification.id,
      preferredLocale: locale,
    });
  }

  await createSession(userId);
  await record('auth.account_created', 'success', { userId });

  redirect('/dashboard');
}

export async function login(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { ok: false, error: 'Controleer de ingevulde gegevens.' };
  }

  const { email, password } = parsed.data;

  const limit = await consume('login', email);
  if (!limit.allowed) {
    await record('auth.login_blocked', 'failure', { meta: { reason: 'rate_limited' } });
    return { ok: false, error: 'Te veel pogingen. Probeer het later opnieuw.' };
  }

  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const user = rows[0];

  if (!user) {
    // Even lang wachten als bij een bestaand account, zodat het antwoord niet
    // verraadt of het e-mailadres bekend is.
    await hashPassword(password);
    await record('auth.login', 'failure', { meta: { reason: 'unknown_user' } });
    return { ok: false, error: 'E-mailadres of wachtwoord is onjuist.' };
  }

  if (user.lockedUntil && user.lockedUntil > nowSeconds()) {
    await record('auth.login', 'failure', {
      userId: user.id,
      meta: { reason: 'locked' },
    });
    return { ok: false, error: 'Account is tijdelijk geblokkeerd. Probeer het later opnieuw.' };
  }

  const valid = await verifyPassword(user.passwordHash, password);

  if (!valid) {
    const failedCount = user.failedLoginCount + 1;
    const lock = failedCount >= LOCK_THRESHOLD;

    await db
      .update(users)
      .set({
        failedLoginCount: failedCount,
        lockedUntil: lock ? nowSeconds() + LOCK_DURATION_SECONDS : null,
      })
      .where(eq(users.id, user.id));

    await record(lock ? 'auth.account_locked' : 'auth.login', 'failure', {
      userId: user.id,
      meta: { failedCount },
    });

    return { ok: false, error: 'E-mailadres of wachtwoord is onjuist.' };
  }

  await db
    .update(users)
    .set({ failedLoginCount: 0, lockedUntil: null, lastLoginAt: nowSeconds() })
    .where(eq(users.id, user.id));

  await reset('login', email);
  await pruneExpiredSessions();

  const mfaRequired = Boolean(user.totpSecret && user.totpEnabledAt);
  await createSession(user.id, { mfaSatisfied: !mfaRequired });

  if (mfaRequired) {
    await record('auth.mfa_challenge', 'success', { userId: user.id });
    return { ok: true, next: 'mfa' };
  }

  await record('auth.login', 'success', { userId: user.id });
  redirect('/dashboard');
}

const totpSchema = z.object({
  code: z.string().trim().regex(/^\d{6}$/),
});

export async function verifyTotp(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: 'Sessie verlopen. Log opnieuw in.' };

  const parsed = totpSchema.safeParse({ code: formData.get('code') });
  if (!parsed.success) return { ok: false, error: 'De code klopt niet of is verlopen.' };

  const limit = await consume('totp', session.user.id);
  if (!limit.allowed) {
    return { ok: false, error: 'Te veel pogingen. Probeer het later opnieuw.' };
  }

  const secret = session.user.totpSecret;
  if (!secret) return { ok: false, error: 'Tweestapsverificatie staat niet aan.' };

  const totp = new TOTP({
    issuer: 'Project115',
    label: session.user.email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(decrypt(secret)),
  });

  // window: 1 accepteert de vorige en volgende tijdvensters, zodat een licht
  // afwijkende klok geen valse afwijzing oplevert.
  const delta = totp.validate({ token: parsed.data.code, window: 1 });

  if (delta === null) {
    await record('auth.mfa_verify', 'failure', { userId: session.user.id });
    return { ok: false, error: 'De code klopt niet of is verlopen.' };
  }

  await markMfaSatisfied(session.sessionId);
  await reset('totp', session.user.id);
  await record('auth.mfa_verify', 'success', { userId: session.user.id });
  await record('auth.login', 'success', { userId: session.user.id });

  redirect('/dashboard');
}

export async function logout(): Promise<void> {
  const session = await getSession();
  if (session) {
    await record('auth.logout', 'success', { userId: session.user.id });
  }
  await destroySession();
  redirect('/login');
}

/* --- Tweestapsverificatie beheren -------------------------------------- */

export interface TotpSetup {
  secret: string;
  uri: string;
  recoveryCodes: string[];
}

/**
 * Genereert een nieuw TOTP-secret en herstelcodes. Het secret wordt pas
 * definitief opgeslagen nadat de gebruiker een geldige code heeft ingevoerd.
 */
export async function beginTotpSetup(): Promise<TotpSetup | null> {
  const session = await getSession();
  if (!session || !session.mfaSatisfied) return null;

  const secret = new Secret({ size: 20 });
  const totp = new TOTP({
    issuer: 'Project115',
    label: session.user.email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  });

  const recoveryCodes = Array.from({ length: 8 }, () =>
    generateToken(6).replace(/[-_]/g, '').slice(0, 10).toUpperCase(),
  );

  return {
    secret: secret.base32,
    uri: totp.toString(),
    recoveryCodes,
  };
}

const enableTotpSchema = z.object({
  secret: z.string().min(16).max(64),
  code: z.string().trim().regex(/^\d{6}$/),
  recoveryCodes: z.string(),
});

export async function enableTotp(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session || !session.mfaSatisfied) {
    return { ok: false, error: 'Niet ingelogd.' };
  }

  const parsed = enableTotpSchema.safeParse({
    secret: formData.get('secret'),
    code: formData.get('code'),
    recoveryCodes: formData.get('recoveryCodes'),
  });
  if (!parsed.success) return { ok: false, error: 'Ongeldige invoer.' };

  const totp = new TOTP({
    issuer: 'Project115',
    label: session.user.email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(parsed.data.secret),
  });

  if (totp.validate({ token: parsed.data.code, window: 1 }) === null) {
    return { ok: false, error: 'De code klopt niet. Controleer de tijd op je apparaat.' };
  }

  const codes: string[] = JSON.parse(parsed.data.recoveryCodes);
  // Herstelcodes worden gehasht opgeslagen; ze zijn hoog-entropie, dus SHA-256
  // volstaat en een dure KDF is hier niet nodig.
  const hashedCodes = codes.map((code) => sha256(code));

  await db
    .update(users)
    .set({
      totpSecret: encrypt(parsed.data.secret),
      totpEnabledAt: nowSeconds(),
      recoveryCodes: JSON.stringify(hashedCodes),
    })
    .where(eq(users.id, session.user.id));

  await record('auth.mfa_enabled', 'success', { userId: session.user.id });
  return { ok: true };
}

export async function disableTotp(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session || !session.mfaSatisfied) return { ok: false, error: 'Niet ingelogd.' };

  const password = formData.get('password');
  if (typeof password !== 'string') return { ok: false, error: 'Wachtwoord vereist.' };

  // Uitschakelen verlaagt de beveiliging; dat mag alleen met het wachtwoord.
  if (!(await verifyPassword(session.user.passwordHash, password))) {
    await record('auth.mfa_disabled', 'failure', { userId: session.user.id });
    return { ok: false, error: 'Wachtwoord is onjuist.' };
  }

  await db
    .update(users)
    .set({ totpSecret: null, totpEnabledAt: null, recoveryCodes: null })
    .where(eq(users.id, session.user.id));

  await record('auth.mfa_disabled', 'success', { userId: session.user.id });
  return { ok: true };
}

/* --- Wachtwoord wijzigen ----------------------------------------------- */

const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

export async function changePassword(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session || !session.mfaSatisfied) return { ok: false, error: 'Niet ingelogd.' };

  const limit = await consume('passwordChange', session.user.id);
  if (!limit.allowed) {
    return { ok: false, error: 'Te veel pogingen. Probeer het later opnieuw.' };
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
  });
  if (!parsed.success) return { ok: false, error: 'Controleer de ingevulde gegevens.' };

  if (!(await verifyPassword(session.user.passwordHash, parsed.data.currentPassword))) {
    await record('auth.password_changed', 'failure', { userId: session.user.id });
    return { ok: false, error: 'Huidig wachtwoord is onjuist.' };
  }

  const strength = checkPasswordStrength(parsed.data.newPassword, {
    email: session.user.email,
    displayName: session.user.displayName,
  });
  if (!strength.ok) {
    return { ok: false, error: strength.reason ?? 'Kies een sterker wachtwoord.' };
  }

  await db
    .update(users)
    .set({
      passwordHash: await hashPassword(parsed.data.newPassword),
      updatedAt: nowSeconds(),
    })
    .where(eq(users.id, session.user.id));

  // Alle andere sessies verlopen: als er iemand meekeek, is die er nu uit.
  await destroyAllSessions(session.user.id);
  await createSession(session.user.id);

  await record('auth.password_changed', 'success', { userId: session.user.id });
  return { ok: true };
}

const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  locale: z.enum(['nl', 'en']),
});

/**
 * Naam en interfacetaal wijzigen.
 *
 * De taal stond alleen bij registratie vast, waardoor je hem daarna nergens
 * meer kon veranderen — de keuze op de instellingenpagina bleek de oefentaal
 * per studieplan te zijn, wat iets anders is. Dit is de ontbrekende instelling.
 *
 * `revalidatePath('/', 'layout')` is nodig omdat de taal in het serverdeel
 * wordt opgehaald: zonder die aanroep staat de oude taal er tot de volgende
 * volledige paginalading.
 */
export async function updateProfile(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session || !session.mfaSatisfied) return { ok: false, error: 'Niet ingelogd.' };

  const parsed = profileSchema.safeParse({
    displayName: formData.get('displayName'),
    locale: formData.get('locale'),
  });
  if (!parsed.success) return { ok: false, error: 'Controleer de ingevulde gegevens.' };

  await db
    .update(users)
    .set({
      displayName: parsed.data.displayName,
      locale: parsed.data.locale,
      updatedAt: nowSeconds(),
    })
    .where(eq(users.id, session.user.id));

  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function logoutEverywhere(): Promise<void> {
  const session = await getSession();
  if (!session) redirect('/login');

  await destroyAllSessions(session.user.id);
  await record('auth.logout', 'success', {
    userId: session.user.id,
    meta: { scope: 'all' },
  });
  redirect('/login');
}
