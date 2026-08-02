import { getSettings, saveSettings, getMeta, setMeta } from './store';

/**
 * Pincodevergrendeling.
 *
 * De webversie gebruikt Argon2id en TOTP. Dat hoort daar: die server staat aan
 * het netwerk en bedient meerdere sessies. Deze app draait op één toestel dat
 * je zelf in je zak hebt, achter de schermvergrendeling van Android. Een
 * tweede factor toevoegen zou hier alleen maar drempel zijn zonder dat er een
 * aanvaller is die hij tegenhoudt.
 *
 * Wat de pincode wél doet: voorkomen dat iemand die je ontgrendelde telefoon
 * even vasthoudt in je studiegegevens kan kijken. Daar past PBKDF2 met een
 * ruime iteratietelling bij — beschikbaar in WebCrypto, geen native module
 * nodig, en traag genoeg om een pincode van vier cijfers niet in een oogwenk
 * te laten bruteforcen.
 *
 * Wat de pincode niet doet: je gegevens versleutelen. Wie de telefoon root of
 * de app-data uitleest, komt er sowieso bij. Dat staat ook zo in de app.
 */

const ITERATIONS = 310_000;
const KEY_LENGTH = 32;

/** Na dit aantal mislukte pogingen op rij volgt een wachttijd. */
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

interface LockoutState {
  failed: number;
  blockedUntil: number | null;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function derive(pin: string, salt: Uint8Array, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    key,
    KEY_LENGTH * 8,
  );

  return toBase64(new Uint8Array(bits));
}

/** Vergelijkt twee gelijk lange strings zonder vroegtijdig af te breken. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isValidPin(pin: string): boolean {
  return /^\d{4,8}$/.test(pin);
}

export async function setPin(pin: string): Promise<void> {
  if (!isValidPin(pin)) throw new Error('Een pincode is vier tot acht cijfers.');

  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const hash = await derive(pin, salt, ITERATIONS);

  const settings = await getSettings();
  await saveSettings({
    ...settings,
    pin: { hash, salt: toBase64(salt), iterations: ITERATIONS },
  });
  await setMeta('lockout', { failed: 0, blockedUntil: null } satisfies LockoutState);
}

export async function removePin(): Promise<void> {
  const settings = await getSettings();
  await saveSettings({ ...settings, pin: null, lockOnBackground: false });
  await setMeta('lockout', { failed: 0, blockedUntil: null } satisfies LockoutState);
}

export async function hasPin(): Promise<boolean> {
  const settings = await getSettings();
  return settings.pin !== null;
}

export interface VerifyResult {
  ok: boolean;
  /** Aantal seconden dat er nog gewacht moet worden, 0 als er geen blokkade is. */
  waitSeconds: number;
  attemptsLeft: number;
}

export async function verifyPin(pin: string): Promise<VerifyResult> {
  const settings = await getSettings();
  if (!settings.pin) return { ok: true, waitSeconds: 0, attemptsLeft: MAX_ATTEMPTS };

  const now = Math.floor(Date.now() / 1000);
  const state = (await getMeta<LockoutState>('lockout')) ?? {
    failed: 0,
    blockedUntil: null,
  };

  if (state.blockedUntil !== null && state.blockedUntil > now) {
    return {
      ok: false,
      waitSeconds: state.blockedUntil - now,
      attemptsLeft: 0,
    };
  }

  const candidate = await derive(pin, fromBase64(settings.pin.salt), settings.pin.iterations);

  if (constantTimeEqual(candidate, settings.pin.hash)) {
    await setMeta('lockout', { failed: 0, blockedUntil: null } satisfies LockoutState);
    return { ok: true, waitSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
  }

  const failed = state.failed + 1;
  const blocked = failed >= MAX_ATTEMPTS;

  await setMeta('lockout', {
    failed: blocked ? 0 : failed,
    // Elke ronde van vijf mislukte pogingen levert een minuut wachten op. Lang
    // genoeg om raden onaantrekkelijk te maken, kort genoeg om jezelf niet uit
    // je eigen aantekeningen te sluiten.
    blockedUntil: blocked ? now + LOCKOUT_SECONDS : null,
  } satisfies LockoutState);

  return {
    ok: false,
    waitSeconds: blocked ? LOCKOUT_SECONDS : 0,
    attemptsLeft: blocked ? 0 : MAX_ATTEMPTS - failed,
  };
}
