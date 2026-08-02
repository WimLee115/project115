import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Bouwt de browserversie.
 *
 * De Android-app en de browserversie delen alle code, maar niet hun
 * verpakking: in de APK zitten de bestanden al op het toestel, dus daar is een
 * service worker overbodig en zelfs schadelijk — hij zou een oude versie kunnen
 * vasthouden naast een net geïnstalleerde update. In de browser is diezelfde
 * service worker juist het enige wat de app offline houdt.
 *
 * Vandaar dit script in plaats van een plugin. Het is niet ingewikkeld genoeg
 * om er een afhankelijkheid voor binnen te halen: de precachelijst is een
 * mapinhoud, en de installatielogica van een service worker past in twintig
 * regels. Dat is dezelfde afweging als bij de router en de tweetaligheid.
 */

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = join(root, 'dist-web');

/** Bestanden die niet meegecachet hoeven worden. */
const SKIP = new Set(['sw.js', '.DS_Store']);

function walk(directory: string): string[] {
  const found: string[] = [];

  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) {
      found.push(...walk(full));
    } else if (!SKIP.has(entry)) {
      found.push(full);
    }
  }

  return found;
}

console.log('[web] bouwen...');
execFileSync('npx', ['vite', 'build', '--mode', 'web'], {
  cwd: root,
  stdio: 'inherit',
});

const assets = walk(outDir)
  .map((path) => `./${relative(outDir, path).split(sep).join('/')}`)
  .sort();

/**
 * De versienaam maakt de cache uniek. Bij een nieuwe build krijgen de
 * JS-bestanden een andere hash, dus verandert deze lijst, dus verandert de
 * naam — en ruimt de service worker de oude versie op.
 */
const version = createVersion(assets);

const serviceWorker = `/*
 * Project115 — service worker.
 *
 * Automatisch gegenereerd door scripts/build-web.ts. Niet met de hand
 * aanpassen; de wijziging is bij de volgende build weer weg.
 *
 * Strategie: alles wat de app nodig heeft staat na de installatie in de cache
 * en wordt daar ook uit geserveerd. Er is geen server om op terug te vallen en
 * geen gegeven dat vers hoeft te zijn — de vragenbank zit in de bundel en je
 * voortgang staat in IndexedDB, niet achter een verzoek.
 */

const CACHE = 'project115-${version}';

const ASSETS = ${JSON.stringify(assets, null, 2)};

self.addEventListener('install', (event) => {
  // Meteen actief worden; wachten tot alle tabbladen dicht zijn heeft bij een
  // app die je als één venster gebruikt geen zin.
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Elke navigatie komt uit op dezelfde pagina; de routes van deze app zitten
  // in de hash en niet in het pad.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((hit) => hit ?? fetch(request)),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      // Onbekend bestand: alsnog ophalen en bewaren, zodat een gemiste asset
      // niet elke keer opnieuw over de lijn hoeft.
      return fetch(request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          void caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
`;

writeFileSync(join(outDir, 'sw.js'), serviceWorker, 'utf8');

/* --- De pagina aan de service worker en het manifest knopen --------------- */

const indexPath = join(outDir, 'index.html');
const html = readFileSync(indexPath, 'utf8');

if (html.includes('manifest.webmanifest')) {
  throw new Error('index.html verwijst al naar het manifest; dubbel injecteren.');
}

const injection = `    <link rel="manifest" href="./manifest.webmanifest" />
    <script>
      // Alleen in de browser. In de Android-app bestaat dit bestand niet, en
      // daar is het ook niet nodig.
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js').catch(() => {
            // Zonder service worker werkt de app nog steeds, alleen niet offline.
          });
        });
      }
    </script>
  </head>`;

writeFileSync(indexPath, html.replace('  </head>', injection), 'utf8');

const bytes = walk(outDir).reduce((sum, path) => sum + statSync(path).size, 0);

console.log(`[web] klaar: ${assets.length} bestanden, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`[web] cache: project115-${version}`);
console.log(`[web] map:   ${outDir}`);

/**
 * Korte, stabiele naam voor deze build.
 *
 * Afgeleid van de bestandsnamen, die al een inhoudshash bevatten. Geen datum:
 * twee keer bouwen zonder wijziging hoort dezelfde cache op te leveren, anders
 * downloadt iedereen bij elke publicatie alles opnieuw.
 */
function createVersion(files: string[]): string {
  let hash = 0x811c9dc5;
  for (const char of files.join('|')) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}
