import 'server-only';

import { hash, verify } from '@node-rs/argon2';

/**
 * Wachtwoordhashing met Argon2id.
 *
 * Parameters volgen de OWASP-aanbeveling voor Argon2id: 19 MiB geheugen,
 * 2 iteraties, parallellisme 1. Dat is bewust duur — een aanvaller met de
 * databasedump moet per gok dezelfde kosten maken.
 *
 * Het algoritme wordt niet expliciet gezet: Argon2id is de standaard van
 * @node-rs/argon2, en de `Algorithm`-enum is een ambient const enum die niet
 * importeerbaar is onder `isolatedModules`.
 */
const OPTIONS = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
} as const;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, OPTIONS);
}

/**
 * Verifieert een wachtwoord. Gooit nooit: een corrupte hash in de database
 * mag geen 500 opleveren maar moet als 'onjuist' gelden.
 */
export async function verifyPassword(
  storedHash: string,
  password: string,
): Promise<boolean> {
  try {
    return await verify(storedHash, password, OPTIONS);
  } catch {
    return false;
  }
}

/**
 * Minimale wachtwoordeisen.
 *
 * Bewust lengte boven tekensoorten: een lange passphrase is sterker en beter
 * te onthouden dan 'P@ssw0rd!'. We weigeren daarnaast een handvol evidente
 * keuzes en alles wat de gebruiker al elders invult (e-mail, naam).
 */
const COMMON_PASSWORDS = new Set([
  'wachtwoord', 'password', '12345678', '123456789', 'qwertyuiop',
  'welkom123', 'welcome123', 'letmein123', 'project115', 'iloveyou',
  'administrator', 'geheim123', 'changeme', 'passw0rd',
]);

export interface PasswordCheck {
  ok: boolean;
  /** Reden in het Nederlands, direct toonbaar aan de gebruiker. */
  reason?: string;
}

export function checkPasswordStrength(
  password: string,
  context: { email?: string; displayName?: string } = {},
): PasswordCheck {
  if (password.length < 12) {
    return { ok: false, reason: 'Gebruik minimaal 12 tekens.' };
  }
  if (password.length > 256) {
    return { ok: false, reason: 'Maximaal 256 tekens.' };
  }

  const lower = password.toLowerCase();

  if (COMMON_PASSWORDS.has(lower)) {
    return { ok: false, reason: 'Dit wachtwoord komt voor op bekende lijsten.' };
  }

  const localPart = context.email?.split('@')[0]?.toLowerCase();
  if (localPart && localPart.length >= 4 && lower.includes(localPart)) {
    return { ok: false, reason: 'Gebruik je e-mailadres niet in je wachtwoord.' };
  }

  const name = context.displayName?.toLowerCase();
  if (name && name.length >= 4 && lower.includes(name)) {
    return { ok: false, reason: 'Gebruik je naam niet in je wachtwoord.' };
  }

  // Eén teken herhaald ('aaaaaaaaaaaa') haalt de lengte-eis maar is waardeloos.
  if (new Set(password).size < 5) {
    return { ok: false, reason: 'Gebruik meer verschillende tekens.' };
  }

  return { ok: true };
}
