import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { APP_VERSION, SOURCE_URL } from '../src/lib/version';

/**
 * Zet klaar wat er naar andere docenten gaat: één ingepakt bestand.
 *
 * Eén bestand omdat het gemaild wordt en een losse `.apk` door sommige
 * mailproviders geweigerd wordt. Ingepakt scheelt bovendien ruim de helft: de
 * HTML-versie en de APK bevatten allebei dezelfde vragenbank, en die comprimeert
 * uitstekend.
 *
 * Bestand voor bestand kopiëren en niet 'de map minus wat uitzonderingen'. Dat
 * is het punt van dit script: de sleutel waarmee de app wordt ondertekend en
 * het wachtwoord ervan staan in dezelfde projectmap. Wie die twee heeft, kan een
 * update uitbrengen die Android accepteert als jouw app. Wat hier niet expliciet
 * in gezet wordt, komt er niet in — en na afloop wordt het resultaat nog
 * nagelopen.
 */

const root = fileURLToPath(new URL('..', import.meta.url));
const release = join(root, 'release');

/*
 * Zonder APK, voor als de mail wordt geweigerd.
 *
 * Mailgateways blokkeren installatiebestanden ook binnen een archief, en een
 * APK is zelf een zip — die wordt op inhoud herkend en niet op extensie, dus
 * hernoemen helpt niet. Met deze schakelaar gaat alleen het losse
 * HTML-bestand en de webversie mee, en wordt de installatie-instructie
 * meteen aangepast: een handleiding die verwijst naar een bijlage die er niet
 * is, is erger dan een ontbrekende bijlage.
 */
const withoutApk = process.argv.includes('--zonder-apk');

const bundleName = `Project115-${APP_VERSION}${withoutApk ? '-zonder-app' : ''}`;
const staging = join(release, bundleName);

const sources = {
  apk: join(root, 'android/app/build/outputs/apk/release/app-release.apk'),
  single: join(root, `dist-single/Project115-${APP_VERSION}-offline.html`),
  web: join(root, 'dist-web'),
  /*
   * De begeleidende teksten staan in de hoofdmap van het project.
   *
   * Ze stonden ooit ook hier, in `android-app/docs/`, als tweede set naast die
   * van de webhub. Die twee liepen uit elkaar: de handleidingen scheelden op
   * het laatst 285 regels en telden een verschillend aantal pagina's, en de
   * gebruiksvoorwaarden die daadwerkelijk werden meegestuurd misten de
   * vermelding van IT Management Group — precies de vermelding die voorwaarde
   * 3 van de licentie verplicht stelt. Eén set voorkomt dat.
   */
  docs: join(root, '..'),
};

/** Namen die nooit in het pakket mogen belanden, wat er verder ook gebeurt. */
const FORBIDDEN = [
  'release-key.jks',
  'keystore.properties',
  '.env',
  // Geschreven voor de afzender, niet voor de ontvanger.
  'mail-aan-cees',
];

function require(path: string, hint: string): void {
  if (!existsSync(path)) throw new Error(`Ontbreekt: ${path}\n  ${hint}`);
}

if (!withoutApk) require(sources.apk, 'Draai eerst `npm run android:release`.');
require(sources.single, 'Draai eerst `npm run build:single`.');
require(sources.web, 'Draai eerst `npm run build:web`.');

rmSync(release, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });

/* --- 1. De drie vormen ---------------------------------------------------- */

// Op volgorde van hoe makkelijk het uitproberen is.
copyFileSync(sources.single, join(staging, `Project115-${APP_VERSION}-offline.html`));

if (!withoutApk) {
  copyFileSync(sources.apk, join(staging, `Project115-${APP_VERSION}.apk`));
}

execFileSync(
  'zip',
  ['-q', '-r', join(staging, `Project115-${APP_VERSION}-web.zip`), '.'],
  { cwd: sources.web },
);

/* --- 2. De begeleidende teksten ------------------------------------------- */

/*
 * Wat de ontvanger nodig heeft, en niets meer. Bij naam opgesomd en niet 'de
 * map met documentatie': daar staan ook stukken die voor de afzender zijn
 * geschreven, zoals de conceptmail in `../../docs/`, en die gaan de ontvanger
 * niets aan. Wat hier niet staat, gaat niet mee — en het resultaat wordt
 * onderaan nog nagelopen.
 */
const DOCS = [
  'Project115 - Handleiding.pdf',
  'INSTALLEREN.md',
  'GEBRUIKSVOORWAARDEN.md',
  'PRIVACY.md',
];

for (const doc of DOCS) {
  const path = join(sources.docs, doc);
  require(path, 'Ontbreekt in de hoofdmap; de handleiding maak je met `npm run docs`.');

  if (doc === 'INSTALLEREN.md' && withoutApk) {
    writeFileSync(join(staging, doc), stripAndroid(readFileSync(path, 'utf8')), 'utf8');
    continue;
  }

  copyFileSync(path, join(staging, doc));
}

/** Haalt het Android-hoofdstuk eruit en zet er een verwijzing voor in de plaats. */
function stripAndroid(markdown: string): string {
  const start = markdown.indexOf('<!-- ANDROID:start -->');
  const end = markdown.indexOf('<!-- ANDROID:end -->');

  if (start === -1 || end === -1) {
    throw new Error('De markeringen rond het Android-hoofdstuk ontbreken in INSTALLEREN.md.');
  }

  const replacement = `## De Android-app

Die zit niet in dit pakket. Mailproviders weigeren installatiebestanden, ook
binnen een zip, en de mail komt dan niet aan.

Wil je hem op je telefoon, vraag er dan even om — of haal hem op via
${SOURCE_URL}. De app in de browser is verder precies dezelfde.
`;

  return markdown
    .slice(0, start)
    .concat(replacement, markdown.slice(end + '<!-- ANDROID:end -->'.length))
    .replace('<!-- KEUZES -->\nJe hebt drie mogelijkheden.', 'Je hebt twee mogelijkheden.')
    .replace('<!-- KEUZES -->\n', '');
}

/* --- 3. Inpakken ---------------------------------------------------------- */

const archive = join(release, `${bundleName}.zip`);
execFileSync('zip', ['-q', '-r', '-9', archive, bundleName], { cwd: release });

/* --- 4. Nalopen ----------------------------------------------------------- */

function walk(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const full = join(directory, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// Alle namen in het eindarchief, inclusief die in de ingepakte webversie.
const listing = execFileSync('unzip', ['-Z1', archive], { encoding: 'utf8' });
const inner = execFileSync(
  'unzip',
  ['-Z1', join(staging, `Project115-${APP_VERSION}-web.zip`)],
  { encoding: 'utf8' },
);

for (const forbidden of FORBIDDEN) {
  if (listing.includes(forbidden) || inner.includes(forbidden)) {
    rmSync(release, { recursive: true, force: true });
    throw new Error(
      `AFGEBROKEN: '${forbidden}' zat in het pakket. Het pakket is verwijderd.`,
    );
  }
}

/* --- 5. Verslag ----------------------------------------------------------- */

const size = statSync(archive).size;

console.log('');
console.log(`  Project115 ${APP_VERSION}${withoutApk ? ' — zonder Android-app' : ''}`);
console.log('');

for (const path of walk(staging).sort()) {
  console.log(
    `  ${relative(staging, path).padEnd(34)} ${(statSync(path).size / 1024).toFixed(0).padStart(7)} kB`,
  );
}

console.log('');
console.log(`  → ${relative(root, archive)}`.padEnd(38) + `${(size / 1024 / 1024).toFixed(2)} MB`);
console.log('');
console.log('  Geen ondertekeningsgegevens aangetroffen.');
console.log(
  size < 25 * 1024 * 1024
    ? '  Past ruim binnen de bijlagelimiet van ProtonMail (25 MB).'
    : '  LET OP: groter dan de bijlagelimiet van ProtonMail (25 MB).',
);
console.log('');
