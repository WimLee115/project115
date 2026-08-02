import 'server-only';

import {
  randomBytes,
  createHash,
  createCipheriv,
  createDecipheriv,
  timingSafeEqual,
  scryptSync,
} from 'node:crypto';

/**
 * Cryptografische bouwstenen.
 *
 * Alles wat hier staat draait uitsluitend op de server: de sleutel komt uit
 * `APP_SECRET` en mag de client nooit bereiken.
 */

const KEY_LENGTH = 32; // AES-256
const IV_LENGTH = 12; // GCM standaard
const TAG_LENGTH = 16;

let cachedKey: Buffer | null = null;

/**
 * Leidt de encryptiesleutel af uit APP_SECRET. We gebruiken scrypt zodat een
 * zwak gekozen secret nog steeds een dure afleiding vereist.
 */
function getKey(): Buffer {
  if (cachedKey) return cachedKey;

  const secret = process.env.APP_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'APP_SECRET ontbreekt of is te kort (minimaal 32 tekens). ' +
        'Genereer er een met: openssl rand -base64 48',
    );
  }

  cachedKey = scryptSync(secret, 'project115.kdf.v1', KEY_LENGTH);
  return cachedKey;
}

/** Versleutelt een string met AES-256-GCM. Output: iv.tag.ciphertext in base64url. */
export function encrypt(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-gcm', getKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    iv.toString('base64url'),
    tag.toString('base64url'),
    ciphertext.toString('base64url'),
  ].join('.');
}

/** Ontsleutelt wat `encrypt` heeft geproduceerd. Gooit bij manipulatie. */
export function decrypt(payload: string): string {
  const parts = payload.split('.');
  if (parts.length !== 3) {
    throw new Error('Ongeldige ciphertext-structuur');
  }
  const [ivPart, tagPart, dataPart] = parts as [string, string, string];

  const iv = Buffer.from(ivPart, 'base64url');
  const tag = Buffer.from(tagPart, 'base64url');
  const data = Buffer.from(dataPart, 'base64url');

  if (iv.length !== IV_LENGTH || tag.length !== TAG_LENGTH) {
    throw new Error('Ongeldige ciphertext-parameters');
  }

  const decipher = createDecipheriv('aes-256-gcm', getKey(), iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(data), decipher.final()]).toString(
    'utf8',
  );
}

/** Cryptografisch willekeurig token, geschikt voor sessies en herstelcodes. */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}

/**
 * SHA-256 in hex. Gebruikt om sessietokens en IP-adressen op te slaan zonder
 * de originele waarde te bewaren.
 */
export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * Hasht een IP-adres met een applicatiespecifieke peper, zodat een
 * databaselek geen bruikbare IP-geschiedenis oplevert (de zoekruimte van
 * IPv4 is klein genoeg om zonder peper triviaal te bruteforcen).
 */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const secret = process.env.APP_SECRET ?? '';
  return createHash('sha256').update(`${secret}:ip:${ip}`).digest('hex');
}

/** Vergelijkt twee strings in constante tijd. */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  // timingSafeEqual eist gelijke lengte; hash eerst zodat lengte nooit lekt.
  const hashA = createHash('sha256').update(bufA).digest();
  const hashB = createHash('sha256').update(bufB).digest();
  return timingSafeEqual(hashA, hashB);
}

/** Genereert een UUIDv4-achtige identifier zonder externe dependency. */
export function newId(prefix?: string): string {
  const id = randomBytes(16).toString('hex');
  return prefix ? `${prefix}_${id}` : id;
}
