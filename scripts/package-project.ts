import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Pakt het volledige project in: broncode, content, documentatie en het
 * verzendklare pakket, in één zip.
 *
 * Dit is een ander bestand dan wat er naar docenten gaat. Dat pakket bevat
 * alleen de werkende app; dit bevat alles wat nodig is om hem opnieuw te
 * bouwen — bedoeld als back-up en als startpunt voor een repository.
 *
 * De uitdaging is niet het inpakken maar het wéglaten. In deze projectmap staan
 * drie soorten gegevens die nergens anders horen te komen:
 *
 *  1. `data/project115.db` — de database van de webversie, met wachtwoordhashes,
 *     sessies, TOTP-secrets en het auditlogboek van de gebruiker;
 *  2. `.env` — het `APP_SECRET` waarmee die TOTP-secrets versleuteld zijn;
 *  3. `release-key.jks` en `keystore.properties` — de sleutel waarmee de
 *     Android-app wordt ondertekend.
 *
 * Uitsluiten op naam is de eerste helft. De tweede helft staat onderaan: het
 * resultaat wordt doorzocht op de wáárde van `APP_SECRET`, zodat een kopie die
 * onder een andere naam is blijven staan alsnog opvalt.
 */

const root = fileURLToPath(new URL('..', import.meta.url));
const release = join(root, 'release');

const version =
  (JSON.parse(
    readFileSync(join(root, 'android-app/package.json'), 'utf8'),
  ) as { version: string }).version;

const bundleName = `Project115-${version}-volledig`;
const staging = join(release, bundleName);

/** Mappen die nergens voor nodig zijn: te herbouwen of te downloaden. */
const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  'dist-web',
  'dist-single',
  '.single-build',
  '.gradle',
  'build',
  'release',
  'e2e-screenshots',
  'data',
]);

/** Bestanden die geheimen of persoonlijke gegevens bevatten. */
const SECRET_FILES = [
  '.env',
  '.env.backup',
  '.env.local',
  '.env.production',
  'release-key.jks',
  'keystore.properties',
  'local.properties',
];

/** Rommel die alleen op deze machine betekenis heeft. */
const SKIP_FILES = new Set([
  'tsconfig.tsbuildinfo',
  'start.log',
  '.DS_Store',
  'project115.db',
  'project115.db-shm',
  'project115.db-wal',
]);

function isSecret(name: string): boolean {
  return SECRET_FILES.includes(name) || name.endsWith('.jks') || name.endsWith('.keystore');
}

function collect(directory: string, found: string[] = []): string[] {
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);

    if (statSync(full).isDirectory()) {
      if (SKIP_DIRS.has(entry)) continue;
      collect(full, found);
      continue;
    }

    if (SKIP_FILES.has(entry) || isSecret(entry)) continue;
    if (entry.endsWith('.apk') || entry.endsWith('.aab')) continue;

    found.push(full);
  }

  return found;
}

rmSync(release, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });

/* --- 1. De broncode ------------------------------------------------------- */

const files = collect(root);

for (const file of files) {
  const target = join(staging, relative(root, file));
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(file, target);
}

/* --- 2. Het verzendklare pakket erbij ------------------------------------- */

const distributable = join(root, `android-app/release/Project115-${version}.zip`);

if (existsSync(distributable)) {
  copyFileSync(distributable, join(staging, `Project115-${version}.zip`));
} else {
  console.warn(
    `[let op] ${relative(root, distributable)} ontbreekt; het verzendklare\n` +
      '         pakket zit niet in dit archief. Draai `npm run package` in\n' +
      '         android-app om het toe te voegen.',
  );
}

/* --- 3. Controleren dat er niets is meegelift ----------------------------- */

const packaged = collect(staging);

for (const file of packaged) {
  const name = file.split(sep).pop() ?? '';
  if (isSecret(name) || SKIP_FILES.has(name)) {
    rmSync(release, { recursive: true, force: true });
    throw new Error(`AFGEBROKEN: ${relative(staging, file)} zat in het archief.`);
  }
}

/*
 * Zoeken op de wáárde en niet alleen op de bestandsnaam.
 *
 * Een `.env` die ooit gekopieerd is naar `env-oud.txt` of naar een notitie
 * wordt door een namenlijst niet gevonden. Deze controle wel.
 *
 * Alleen de sleutels die daadwerkelijk een geheim bevatten. Een eerdere versie
 * vergeleek élke waarde en sloeg aan op `DATABASE_PATH=./data/project115.db`,
 * dat vanzelfsprekend ook in `.env.example` staat. Een controle die bij een pad
 * afgaat, leert je hem te negeren — en dan vangt hij het echte geval ook niet
 * meer.
 */
const SECRET_KEYS = /SECRET|KEY|TOKEN|PASSWORD|PASSPHRASE|SALT|CREDENTIAL/i;

const secrets: string[] = [];
for (const candidate of ['.env', '.env.backup', '.env.local', '.env.production']) {
  const path = join(root, candidate);
  if (!existsSync(path)) continue;

  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) continue;

    const [key, ...rest] = trimmed.split('=');
    if (!key || !SECRET_KEYS.test(key)) continue;

    const value = rest.join('=').trim().replace(/^["']|["']$/g, '');
    // Een placeholder als 'vervang-dit' is geen geheim; een echte waarde is lang.
    if (value.length >= 24) secrets.push(value);
  }
}

for (const file of packaged) {
  // Alleen tekstbestanden; een geheim in een PNG is geen realistisch geval.
  if (/\.(png|jpg|jpeg|pdf|zip|jks|ico|woff2?)$/i.test(file)) continue;

  const contents = readFileSync(file, 'utf8');
  for (const secret of secrets) {
    if (contents.includes(secret)) {
      rmSync(release, { recursive: true, force: true });
      throw new Error(
        `AFGEBROKEN: een waarde uit .env staat in ${relative(staging, file)}.`,
      );
    }
  }
}

/* --- 4. Inpakken ---------------------------------------------------------- */

const archive = join(release, `${bundleName}.zip`);
execFileSync('zip', ['-q', '-r', '-9', archive, bundleName], { cwd: release });
rmSync(staging, { recursive: true, force: true });

/* --- 5. Verslag ----------------------------------------------------------- */

const size = statSync(archive).size;
const listing = execFileSync('unzip', ['-Z1', archive], { encoding: 'utf8' })
  .trim()
  .split('\n');

/** Aantal bestanden per hoofdmap, zodat je ziet wat erin zit. */
const perArea = new Map<string, number>();
for (const entry of listing) {
  if (entry.endsWith('/')) continue;
  const parts = entry.split('/').slice(1);
  const area = parts.length > 1 ? parts[0] : '(hoofdmap)';
  perArea.set(area as string, (perArea.get(area as string) ?? 0) + 1);
}

console.log('');
console.log(`  Project115 ${version} — volledig project`);
console.log('');

for (const [area, count] of [...perArea].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${area.padEnd(26)} ${String(count).padStart(5)} bestanden`);
}

console.log('');
console.log(`  → ${relative(root, archive)}`.padEnd(34) + `${(size / 1024 / 1024).toFixed(2)} MB`);
console.log('');
console.log('  Uitgesloten en gecontroleerd:');
console.log('    · data/            database met wachtwoordhashes en TOTP-secrets');
console.log('    · .env             APP_SECRET');
console.log('    · release-key.jks  ondertekeningssleutel van de Android-app');
console.log('    · node_modules, buildmappen');
console.log('');
