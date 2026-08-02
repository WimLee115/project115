import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Versiebewaking over het hele project.
 *
 * Het versienummer staat op vier plekken in code en configuratie, en in de
 * documentatie nog eens in bestandsnamen die naar een uitgave verwijzen. Bij
 * 1.1.0 liep dat uit elkaar: de release heette 1.1.0 terwijl de downloadtabel
 * in README.md nog naar `Project115-1.0.0-offline.html` wees — een bestand dat
 * niet meer bestond. Wie de README las en op de downloadlink klikte, kreeg
 * andere namen te zien dan de tabel noemde.
 *
 * Deze test vangt dat vóór een uitgave in plaats van erna. Hij is bewust
 * tekstueel: de documentatie wordt gelezen als tekst, niet geïmporteerd, zodat
 * hij ook over de Android-schil en de HTML-handleiding heen kijkt.
 */

const root = fileURLToPath(new URL('..', import.meta.url));

function lees(...pad: string[]): string {
  return readFileSync(join(root, ...pad), 'utf8');
}

/** De ene waarheid. Alles hieronder wordt hiermee vergeleken. */
const VERSIE = (JSON.parse(lees('package.json')) as { version: string }).version;

/** Mappen zonder documentatie die wij onderhouden: bouwuitvoer en pakketten. */
const OVERSLAAN = new Set([
  '.git',
  '.next',
  'node_modules',
  'android',
  'release',
  'dist',
  'dist-web',
  'dist-single',
  'out',
  'build',
  'e2e-screenshots',
  'drizzle',
  'data',
]);

/**
 * Bestanden met een versienummer dat níét dat van de app is.
 *
 * CODE_OF_CONDUCT.md draagt het versienummer van de Contributor Covenant, en
 * correspondentie in `docs/` (door .gitignore buiten de repository gehouden)
 * noemt de versie die op dat moment werd meegestuurd. Beide horen niet mee te
 * lopen met een nieuwe uitgave.
 */
function uitgezonderd(naam: string): boolean {
  return naam === 'CODE_OF_CONDUCT.md' || /^(mail|brief)-/.test(naam);
}

const PATRONEN = [
  // Bestandsnamen van uitgaven: `Project115-1.1.0-offline.html`.
  /Project115-(\d+\.\d+\.\d+)/g,
  // Versieregels in de kop of de voettekst van een document.
  /[Vv]ersie (\d+\.\d+\.\d+)/g,
];

function documenten(map: string): string[] {
  return readdirSync(map).flatMap((naam) => {
    const pad = join(map, naam);
    if (statSync(pad).isDirectory()) {
      return OVERSLAAN.has(naam) ? [] : documenten(pad);
    }
    return /\.(md|html)$/.test(naam) && !uitgezonderd(naam) ? [pad] : [];
  });
}

describe('versienummer', () => {
  test('is een gewoon semver-nummer', () => {
    assert.match(VERSIE, /^\d+\.\d+\.\d+$/);
  });

  test('is in code en configuratie overal hetzelfde', () => {
    const android = JSON.parse(lees('android-app', 'package.json')) as {
      version: string;
    };
    assert.equal(android.version, VERSIE, 'android-app/package.json');

    const appVersion = /APP_VERSION = '([^']+)'/.exec(
      lees('android-app', 'src', 'lib', 'version.ts'),
    )?.[1];
    assert.equal(appVersion, VERSIE, 'APP_VERSION in android-app/src/lib/version.ts');

    // Bepaalt of Android een APK als update accepteert; loopt die achter, dan
    // installeert de nieuwe uitgave niet over de oude heen.
    const versionName = /versionName "([^"]+)"/.exec(
      lees('android-app', 'android', 'app', 'build.gradle'),
    )?.[1];
    assert.equal(
      versionName,
      VERSIE,
      'versionName in android-app/android/app/build.gradle',
    );
  });

  test('staat overal in de documentatie gelijk', () => {
    const afwijkingen: string[] = [];

    for (const pad of documenten(root)) {
      const tekst = readFileSync(pad, 'utf8');

      for (const patroon of PATRONEN) {
        for (const match of tekst.matchAll(patroon)) {
          if (match[1] === VERSIE) continue;
          const regel = tekst.slice(0, match.index).split('\n').length;
          afwijkingen.push(`${relative(root, pad)}:${regel} — ${match[0]}`);
        }
      }
    }

    assert.deepEqual(
      afwijkingen,
      [],
      `Deze verwijzingen wijken af van ${VERSIE}. Werk ze bij, of pas package.json aan.`,
    );
  });
});
