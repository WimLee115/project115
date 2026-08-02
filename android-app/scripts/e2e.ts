import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium, type ConsoleMessage, type Page } from 'playwright-core';

/**
 * Doorloop van de hele app in een echte browser.
 *
 * Typecontrole en unittests zeggen niets over of een scherm ook ópkomt. Deze
 * test doet wat een gebruiker doet — een proefexamen starten, veertig vragen
 * beantwoorden, inleveren, het rapport lezen, oefenen, herhalen, exporteren —
 * en beschouwt élke fout in de console als een gezakte test. Een React-fout die
 * niemand ziet is er ook een.
 *
 * Draait tegen `dist-web/`, dus tegen precies de bestanden die verspreid
 * worden, en niet tegen de ontwikkelserver.
 *
 * Gebruik:
 *   npm run build:web && npx tsx scripts/e2e.ts
 */

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist-web');
const shots = join(root, 'e2e-screenshots');

const CHROMIUM = process.env.CHROMIUM_PATH ?? '/usr/bin/chromium';
const PORT = 4319;

let passed = 0;
const failures: string[] = [];

function check(condition: boolean, description: string, detail?: string): void {
  if (condition) {
    passed++;
    console.log(`  [32m✓[0m ${description}`);
  } else {
    failures.push(description);
    console.log(`  [31m✗[0m ${description}${detail ? ` — ${detail}` : ''}`);
  }
}

function section(title: string): void {
  console.log(`\n[1m${title}[0m`);
}

/* --- Statische server over dist-web -------------------------------------- */

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://localhost:${PORT}`);
  // `normalize` plus de prefixcontrole houdt `../` buiten de deur; dit is een
  // testserver, maar een testserver met een directory traversal blijft een
  // directory traversal.
  const target = normalize(join(dist, decodeURIComponent(url.pathname)));

  if (!target.startsWith(dist)) {
    response.writeHead(403).end();
    return;
  }

  const file =
    existsSync(target) && statSync(target).isDirectory()
      ? join(target, 'index.html')
      : target;

  if (!existsSync(file)) {
    response.writeHead(404).end('niet gevonden');
    return;
  }

  response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  response.end(readFileSync(file));
});

/* --- Hulpjes -------------------------------------------------------------- */

const problems: string[] = [];

function watch(page: Page): void {
  page.on('console', (message: ConsoleMessage) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    // Een ontbrekende service worker of favicon tijdens de test is geen
    // applicatiefout.
    if (text.includes('favicon') || text.includes('ServiceWorker')) return;
    problems.push(`console: ${text}`);
  });

  page.on('pageerror', (error) => {
    problems.push(`pagina: ${error.message}`);
  });
}

/** Tekst van de hele pagina, voor grove controles. */
async function bodyText(page: Page): Promise<string> {
  return (await page.textContent('body')) ?? '';
}

async function shoot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: join(shots, `${name}.png`), fullPage: false });
}

async function goto(page: Page, hash: string): Promise<void> {
  await page.goto(`http://localhost:${PORT}/#${hash}`, { waitUntil: 'load' });
  await page.waitForTimeout(400);
}

/* --- De doorloop ---------------------------------------------------------- */

async function run(): Promise<void> {
  mkdirSync(shots, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROMIUM,
    args: ['--no-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    locale: 'nl-NL',
  });

  const page = await context.newPage();
  watch(page);

  /* 1. Opstarten */
  section('Opstarten');

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'load' });
  await page.waitForSelector('.p115-app', { timeout: 10_000 });
  await page.waitForTimeout(800);

  check(await page.isVisible('.p115-tabbar'), 'de onderbalk staat er');
  check((await bodyText(page)).includes('Project115'), 'het dashboard komt op');
  check(
    (await bodyText(page)).includes('Vandaag te herhalen'),
    'het herhaalblok staat op het dashboard',
  );

  const certificationCount = await page.locator('svg circle').count();
  check(certificationCount >= 4, 'beide certificeringen tonen een gereedheidsring');
  await shoot(page, '01-dashboard');

  /* 2. Begrippen */
  section('Begrippen');

  await goto(page, '/glossary');
  check((await bodyText(page)).includes('begrippen'), 'het begrippenscherm komt op');

  await page.fill('input[type="search"]', 'incident');
  await page.waitForTimeout(300);
  const hits = await page.locator('.p115-card > div').count();
  check(hits > 0, 'zoeken op "incident" geeft resultaten', `${hits} rijen`);

  await page.locator('.p115-card button').first().click();
  await page.waitForTimeout(200);
  check(
    (await bodyText(page)).length > 500,
    'een begrip klapt open met zijn definitie',
  );
  await shoot(page, '02-begrippen');

  await page.fill('input[type="search"]', 'xyzzy-bestaat-niet');
  await page.waitForTimeout(300);
  check(
    (await bodyText(page)).includes('Geen begrippen gevonden'),
    'een zoekopdracht zonder treffers meldt dat netjes',
  );

  /* 3. Proefexamen */
  section('Proefexamen');

  await goto(page, '/exam');
  check((await bodyText(page)).includes('Proefexamen instellen'), 'het instelscherm komt op');
  check((await bodyText(page)).includes('Examencondities'), 'de examencondities staan erbij');
  await shoot(page, '03-examen-instellen');

  await page.getByRole('button', { name: 'Start proefexamen' }).click();
  await page.waitForTimeout(1200);

  const examText = await bodyText(page);
  check(/Vraag 1 van \d+/.test(examText), 'het examen start bij vraag 1');
  check(await page.isVisible('[role="timer"]'), 'de klok loopt');
  check(!examText.includes('Toelichting'), 'er is géén toelichting tijdens het examen');

  const total = Number(/Vraag 1 van (\d+)/.exec(examText)?.[1] ?? '0');
  check(total === 40, 'het examen telt 40 vragen', `gevonden: ${total}`);
  await shoot(page, '04-examen-vraag');

  // Markeren en weer terug.
  await page.getByRole('button', { name: /Markeer voor later/ }).click();
  await page.waitForTimeout(250);
  check(
    (await bodyText(page)).includes('Gemarkeerd'),
    'een vraag markeren werkt',
  );

  // Alle vragen beantwoorden: steeds de eerste optie, dan door.
  let answered = 0;
  for (let index = 0; index < total; index++) {
    const options = page.locator('.p115-option');
    if ((await options.count()) === 0) break;

    await options.first().click();
    await page.waitForTimeout(90);
    answered++;

    if (index < total - 1) {
      await page.getByRole('button', { name: 'Volgende', exact: true }).click();
      await page.waitForTimeout(90);
    }
  }

  check(answered === total, 'alle vragen zijn te beantwoorden', `${answered}/${total}`);

  // Overzicht controleren.
  await page.locator('.p115-actionbar button').nth(1).click();
  await page.waitForTimeout(300);
  const overview = await bodyText(page);
  check(overview.includes('Overzicht'), 'het overzicht opent');
  check(
    overview.includes(`${total} beantwoord`) || overview.includes('0 onbeantwoord'),
    'het overzicht telt de antwoorden goed',
    overview.match(/\d+ beantwoord · \d+ onbeantwoord/)?.[0],
  );
  await shoot(page, '05-examen-overzicht');

  await page.getByRole('button', { name: 'Inleveren' }).last().click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Inleveren' }).last().click();
  await page.waitForTimeout(1500);

  /* 4. Rapport */
  section('Examenrapport');

  const report = await bodyText(page);
  check(report.includes('Examenrapport'), 'het rapport komt op');
  check(/Geslaagd|Niet geslaagd/.test(report), 'er staat een uitslag');
  check(report.includes('Score per examengebied'), 'de verdeling per examengebied staat erin');
  check(report.includes('Cesuur'), 'de cesuur staat erbij');
  check(report.includes('Toelichting'), 'de toelichtingen staan er nu wél');
  await shoot(page, '06-rapport');

  const wrongFilter = page.getByRole('button', { name: /^Fout \(\d+\)$/ });
  check(await wrongFilter.isVisible(), 'er is een filter op foute antwoorden');
  await wrongFilter.click();
  await page.waitForTimeout(400);
  await shoot(page, '07-rapport-fout');

  /* 5. Voortgang */
  section('Voortgang');

  await goto(page, '/stats');
  await page.waitForTimeout(600);
  check((await bodyText(page)).includes('Voortgang'), 'het voortgangsscherm komt op');

  await page.locator('.p115-card button').first().click();
  await page.waitForTimeout(800);

  const stats = await bodyText(page);
  check(stats.includes('Examengereedheid'), 'de examengereedheid staat erin');
  check(stats.includes('Score per examengebied'), 'de score per examengebied staat erin');
  check(stats.includes('Zwakste leerdoelen'), 'de zwakste leerdoelen staan erin');
  check(stats.includes('Oefen dit'), 'er staat een knop om gericht te oefenen');
  await shoot(page, '08-voortgang');

  /* 6. Oefenen */
  section('Oefenen');

  await goto(page, '/practice');
  check((await bodyText(page)).includes('Waar wil je op oefenen?'), 'het instelscherm komt op');

  await page.getByRole('button', { name: 'Oefensessie starten' }).click();
  await page.waitForTimeout(1200);

  check(/Vraag 1 van \d+/.test(await bodyText(page)), 'de oefensessie start');

  await page.locator('.p115-option').first().click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Controleer antwoord' }).click();
  await page.waitForTimeout(700);

  const checked = await bodyText(page);
  check(checked.includes('Toelichting'), 'na het nakijken verschijnt de toelichting');
  check(
    (await page.locator('.p115-option[data-state="correct"]').count()) === 1,
    'het juiste antwoord wordt gemarkeerd',
  );
  await shoot(page, '09-oefenen');

  const altToggle = page.getByRole('button', { name: /Toon in het Engels|Toon in het Nederlands/ });
  check(await altToggle.isVisible(), 'de vraag is in de andere taal te tonen');
  await altToggle.click();
  await page.waitForTimeout(300);
  await shoot(page, '10-oefenen-tweetalig');

  /* 7. Herhalen */
  section('Herhalen');

  await goto(page, '/review');
  await page.waitForTimeout(900);

  const review = await bodyText(page);
  check(review.includes('Herhalen'), 'het herhaalscherm komt op');
  check(
    review.includes('Hoe goed wist je dit?') ||
      review.includes('nog te gaan') ||
      review.includes('Toon antwoord') ||
      review.includes('Niets te herhalen'),
    'er is een wachtrij of een nette melding dat hij leeg is',
  );

  if (await page.locator('.p115-option').count()) {
    await page.locator('.p115-option').first().click();
    await page.waitForTimeout(600);
    check(
      (await bodyText(page)).includes('Hoe goed wist je dit?'),
      'na een antwoord verschijnen de beoordelingsknoppen',
    );
    await shoot(page, '11-herhalen');

    await page.getByRole('button', { name: 'Goed', exact: true }).click();
    await page.waitForTimeout(700);
    check(true, 'een beoordeling wordt verwerkt');
  }

  /* 8. Instellingen */
  section('Instellingen');

  await goto(page, '/settings');
  await page.waitForTimeout(700);

  const settings = await bodyText(page);
  check(settings.includes('Instellingen'), 'het instellingenscherm komt op');
  check(settings.includes('Studieplan'), 'het studieplan staat erin');
  check(settings.includes('Handelsmerken'), 'de handelsmerkvermelding staat erin');
  check(settings.includes('Privacy'), 'de privacytoelichting staat erin');
  check(settings.includes('github.com/wimlee115'), 'de GitHub-verwijzing staat erin');
  check(settings.includes('Ontwikkeld door B. van Rooij'), 'het auteurschap staat erin');
  check(!settings.includes('Ontwikkeld en gemaakt'), 'de dubbeling is eruit');
  await shoot(page, '12-instellingen');

  /* 8b. Taal wisselen — dit ging in de webversie mis, dus hier expliciet. */
  section('Taal wisselen');

  await page.getByRole('button', { name: 'Engels', exact: true }).click();
  await page.waitForTimeout(700);

  const english = await bodyText(page);
  check(english.includes('Settings'), 'de interface schakelt naar het Engels');
  check(english.includes('Study plan'), 'ook de kopjes verderop schakelen mee');
  check(!english.includes('Instellingen'), 'er blijft geen Nederlands staan');
  await shoot(page, '12b-engels');

  await goto(page, '/');
  await page.waitForTimeout(700);
  check(
    (await bodyText(page)).includes('Due for review today'),
    'de taalkeuze geldt ook op andere schermen',
  );

  await goto(page, '/glossary');
  await page.waitForTimeout(500);
  check(
    (await bodyText(page)).includes('Glossary'),
    'de begrippenlijst schakelt mee',
  );
  check(
    // De zoekhint zit in een placeholder en dus niet in de tekst van de pagina.
    (await page.getAttribute('input[type="search"]', 'placeholder')) ===
      'Search for a term...',
    'ook de zoekhint schakelt mee',
  );

  // En terug, want de rest van de doorloop is in het Nederlands.
  await goto(page, '/settings');
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Dutch', exact: true }).click();
  await page.waitForTimeout(700);
  check(
    (await bodyText(page)).includes('Instellingen'),
    'terugschakelen naar het Nederlands werkt ook',
  );

  // Examendatum invullen en terugkijken op het dashboard.
  const dateField = page.locator('input[type="date"]').first();
  await dateField.fill('2026-08-05');
  await page.waitForTimeout(600);

  await goto(page, '/');
  await page.waitForTimeout(700);
  check(
    /dagen tot je examen|Vandaag is je examen|Morgen is je examen/.test(await bodyText(page)),
    'de examendatum komt terug op het dashboard',
  );
  await shoot(page, '13-dashboard-met-datum');

  /* 9. Donker thema */
  section('Weergave');

  await goto(page, '/settings');
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Donker', exact: true }).click();
  await page.waitForTimeout(500);

  check(
    (await page.getAttribute('html', 'data-theme')) === 'dark',
    'het donkere thema schakelt om',
  );
  await shoot(page, '14-donker');

  await page.getByRole('button', { name: 'Systeem volgen', exact: true }).click();
  await page.waitForTimeout(400);

  /* 10. Voortgang overleeft een herstart */
  section('Opslag');

  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(1200);

  // Herladen gebeurt op het instellingenscherm, want de hash blijft staan.
  const afterReload = await bodyText(page);
  check(
    afterReload.includes('Instellingen') && afterReload.includes('Studieplan'),
    'de app komt na een herstart weer op waar je was',
  );

  await goto(page, '/stats');
  await page.waitForTimeout(600);
  await page.locator('.p115-card button').first().click();
  await page.waitForTimeout(700);

  check(
    /\d+\/40/.test(await bodyText(page)),
    'de eerder gemaakte poging staat er na de herstart nog',
  );

  /* 11. Onbekende route */
  section('Randgevallen');

  await goto(page, '/bestaat-niet');
  await page.waitForTimeout(500);
  check(
    (await bodyText(page)).includes('Vandaag te herhalen'),
    'een onbekende route valt terug op het dashboard',
  );

  await browser.close();
}

/* --- Uitvoeren ------------------------------------------------------------ */

if (!existsSync(dist)) {
  console.error('dist-web/ ontbreekt. Draai eerst `npm run build:web`.');
  process.exit(1);
}

if (!existsSync(CHROMIUM)) {
  console.error(`Geen Chromium op ${CHROMIUM}. Zet CHROMIUM_PATH.`);
  process.exit(1);
}

server.listen(PORT);
console.log(`\nProject115 — doorloop in de browser (http://localhost:${PORT})`);

try {
  await run();
} catch (cause) {
  failures.push(`afgebroken: ${cause instanceof Error ? cause.message : String(cause)}`);
  console.error(cause);
} finally {
  server.close();
}

section('Uitkomst');

for (const problem of problems) {
  console.log(`  [31m✗[0m ${problem}`);
}

const total = passed + failures.length + problems.length;
console.log(
  `\n  ${passed}/${total} goed` +
    (failures.length ? `, ${failures.length} gezakt` : '') +
    (problems.length ? `, ${problems.length} fout(en) in de console` : ''),
);
console.log(`  Schermafdrukken: ${shots}\n`);

process.exit(failures.length + problems.length > 0 ? 1 : 0);
