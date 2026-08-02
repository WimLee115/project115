import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { APP_VERSION } from '../src/lib/version';
import { getTranslator, LOCALES } from '../src/lib/i18n';

/**
 * Kleine bewakingstests.
 *
 * Het versienummer staat op twee plekken omdat de app niet aan `package.json`
 * mag hangen; deze test zorgt dat die twee niet uit elkaar lopen. En de
 * tweetaligheid heeft geen vertaalbibliotheek die klaagt over een gat, dus dat
 * doet deze test.
 */

describe('versie', () => {
  test('komt overeen met package.json', () => {
    const path = fileURLToPath(new URL('../package.json', import.meta.url));
    const pkg = JSON.parse(readFileSync(path, 'utf8')) as { version?: string };
    assert.equal(APP_VERSION, pkg.version);
  });
});

describe('vertalingen', () => {
  test('geen enkele sleutel is leeg in welke taal dan ook', () => {
    // De sleutels komen uit de Nederlandse woordenlijst; het type garandeert al
    // dat de Engelse dezelfde sleutels heeft, maar niet dat ze gevuld zijn.
    // Alleen het type is hier nodig, niet een vertaler zelf.
    type Sleutel = Parameters<ReturnType<typeof getTranslator>>[0];
    const path = fileURLToPath(new URL('../src/lib/i18n.ts', import.meta.url));
    const source = readFileSync(path, 'utf8');

    const keys = [...source.matchAll(/^\s{2}'([a-z]+\.[A-Za-z.]+)':/gm)].map(
      (match) => match[1] as string,
    );

    assert.ok(keys.length > 100, 'de woordenlijst hoort niet bijna leeg te zijn');

    for (const locale of LOCALES) {
      const translate = getTranslator(locale);
      for (const key of new Set(keys)) {
        const value = translate(key as Sleutel);
        assert.equal(typeof value, 'string', `${locale}: ${key} ontbreekt`);
        assert.ok(value.trim().length > 0, `${locale}: ${key} is leeg`);
      }
    }
  });
});
