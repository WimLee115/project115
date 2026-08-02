import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { APP_VERSION } from '../src/lib/version';

/**
 * Bouwt de app tot één enkel HTML-bestand.
 *
 * Waarom dit bestaat: de gewone browserversie heeft een webserver nodig. Een
 * browser weigert een JavaScript-module te laden vanaf een `file://`-adres —
 * dat is een CORS-regel, geen instelling — dus `dist-web/index.html` openen
 * vanaf een USB-stick of uit een uitgepakte zip levert een wit scherm op.
 *
 * Eén bestand zonder externe verwijzingen heeft dat probleem niet: er valt
 * niets te laden. Daarmee wordt dit de versie die je kunt mailen naar iemand
 * die geen server wil draaien en geen Android heeft — dubbelklikken volstaat,
 * op Windows, macOS en Linux.
 *
 * De prijs is een bestand van ongeveer een megabyte en geen offlinecache
 * (onnodig — het bestand ís al lokaal) en geen installatie op het beginscherm.
 * Voor uitproberen is dat een prima ruil.
 */

const root = fileURLToPath(new URL('..', import.meta.url));
const staging = join(root, '.single-build');
const outFile = join(root, `dist-single/Project115-${APP_VERSION}-offline.html`);

console.log('[single] bouwen...');
execFileSync('npx', ['vite', 'build', '--mode', 'single'], { cwd: root, stdio: 'inherit' });

/* --- Alles in de pagina trekken ------------------------------------------ */

const html = readFileSync(join(staging, 'index.html'), 'utf8');
const assets = join(staging, 'assets');

const files = readdirSync(assets);
const scripts = files.filter((name) => name.endsWith('.js'));
const styles = files.filter((name) => name.endsWith('.css'));

if (scripts.length !== 1) {
  throw new Error(
    `Verwacht één JS-bestand, gevonden: ${scripts.join(', ') || 'geen'}. ` +
      'Staat `inlineDynamicImports` nog aan in vite.config.ts?',
  );
}

const script = readFileSync(join(assets, scripts[0] as string), 'utf8');
const style = styles.map((name) => readFileSync(join(assets, name), 'utf8')).join('\n');

/**
 * `</script>` binnen de bundel zou de inline-tag vroegtijdig sluiten. Dat komt
 * in deze code niet voor, maar één vraagtekst met die reeks erin zou de app
 * stilletjes onbruikbaar maken — vandaar de ontsnapping.
 */
const safeScript = script.replace(/<\/script>/gi, '<\\/script>');

let single = html
  .replace(/\s*<script type="module"[^>]*src="[^"]*"[^>]*><\/script>/g, '')
  .replace(/\s*<link rel="modulepreload"[^>]*>/g, '')
  .replace(/\s*<link rel="stylesheet"[^>]*>/g, '')
  // De pictogrammen zijn losse bestanden en zijn hier niet beschikbaar; zonder
  // deze regel staat er een gebroken verwijzing in de balk van de browser.
  .replace(/\s*<link rel="icon"[^>]*>/g, '')
  .replace(/\s*<link rel="apple-touch-icon"[^>]*>/g, '');

/*
 * Een functie als vervanging, geen tekst.
 *
 * `String.replace` kent in een vervangingstékst betekenis toe aan `$&`, `` $` ``
 * en `$1`. Een geminificeerde bundel staat vol dollartekens, en die werden zo
 * stilletjes vervangen door stukken van de pagina zelf — de app laadde dan met
 * een syntaxisfout die pas in de browser zichtbaar was. Met een functie blijft
 * de invoer letterlijk.
 */
single = single.replace('</head>', () => `  <style>\n${style}\n  </style>\n  </head>`);

single = single.replace(
  '</body>',
  () => `  <script type="module">\n${safeScript}\n  </script>\n  </body>`,
);

mkdirSync(join(root, 'dist-single'), { recursive: true });
writeFileSync(outFile, single, 'utf8');
rmSync(staging, { recursive: true, force: true });

const size = statSync(outFile).size;
console.log(`[single] klaar: ${(size / 1024 / 1024).toFixed(2)} MB`);
console.log(`[single] bestand: ${outFile}`);
