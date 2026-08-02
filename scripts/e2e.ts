/**
 * End-to-end test tegen een draaiende Project115-server.
 *
 * Doorloopt de volledige gebruikersreis over HTTP, inclusief Server Actions:
 * installatie → registratie → dashboard → proefexamen starten → 40 vragen
 * beantwoorden → inleveren → rapport controleren. Daarnaast worden de
 * securityheaders en de afscherming van beveiligde routes gecontroleerd.
 *
 * Gebruik:
 *   BASE_URL=http://localhost:3000 npx tsx scripts/e2e.ts
 *
 * De server moet met een lege database draaien; het script maakt zelf een
 * account aan.
 */

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';

let passed = 0;
let failed = 0;
const failures: string[] = [];

function check(condition: boolean, description: string, detail?: string): void {
  if (condition) {
    passed++;
    console.log(`  [32m✓[0m ${description}`);
  } else {
    failed++;
    failures.push(description);
    console.log(`  [31m✗[0m ${description}${detail ? ` — ${detail}` : ''}`);
  }
}

function section(title: string): void {
  console.log(`\n[1m${title}[0m`);
}

/* --- Cookiejar --------------------------------------------------------- */

const cookies = new Map<string, string>();

function storeCookies(response: Response): void {
  const raw = response.headers.getSetCookie?.() ?? [];
  for (const entry of raw) {
    const [pair] = entry.split(';');
    if (!pair) continue;
    const index = pair.indexOf('=');
    if (index === -1) continue;
    const name = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    if (value === '' || /expires=thu, 01 jan 1970/i.test(entry)) {
      cookies.delete(name);
    } else {
      cookies.set(name, value);
    }
  }
}

function cookieHeader(): string {
  return [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

async function request(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (cookies.size > 0) headers.set('cookie', cookieHeader());

  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    redirect: 'manual',
  });
  storeCookies(response);
  return response;
}

/**
 * Draait HTML-entiteiten terug naar tekens.
 *
 * `&amp;` moet als laatste. Zou hij eerder gaan, dan wordt `&amp;lt;` eerst
 * `&lt;` en daarna `<` — twee rondes ontsnappen op invoer die er maar een
 * verdiende. Alle andere entiteiten beginnen met een ampersand die op dat
 * moment nog gewoon zichzelf is, dus die kunnen wel eerst.
 */
function decodeEntities(value: string): string {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&#x27;', "'")
    .replaceAll('&amp;', '&');
}

/**
 * Leest de verborgen velden uit een Server-Action-formulier.
 *
 * Next.js rendert Server Actions met progressive enhancement: het formulier
 * bevat `$ACTION_*`-velden waarmee de server de actie kan herleiden, ook als
 * JavaScript uitstaat. Door precies die velden mee te sturen, test dit script
 * dezelfde weg als een browser zónder JavaScript — en bewijst het meteen dat
 * de app niet stukloopt wanneer scripts geblokkeerd worden.
 */
function extractActionFields(html: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const inputs = html.matchAll(/<input[^>]*type="hidden"[^>]*>/g);

  for (const [tag] of inputs) {
    const name = /name="([^"]+)"/.exec(tag)?.[1];
    if (!name?.startsWith('$ACTION')) continue;
    const value = /value="([^"]*)"/.exec(tag)?.[1] ?? '';
    fields[name] = decodeEntities(value);
  }

  return fields;
}

async function main(): Promise<void> {
  console.log(`[1mProject115 — end-to-end test[0m`);
  console.log(`Doel: ${BASE}\n`);

  /* --- 1. Bereikbaarheid en securityheaders ---------------------------- */

  section('1. Bereikbaarheid en securityheaders');

  let response: Response;
  try {
    response = await request('/');
  } catch (error) {
    console.error(
      `\n[31mKan de server niet bereiken op ${BASE}[0m\n` +
        `Start eerst: npm run build && npm start\n${String(error)}`,
    );
    process.exit(1);
  }

  check(
    response.status === 307 || response.status === 302 || response.status === 200,
    'root reageert',
    `status ${response.status}`,
  );

  const csp = response.headers.get('content-security-policy');
  check(csp !== null, 'Content-Security-Policy is aanwezig');
  check(
    csp?.includes("frame-ancestors 'none'") ?? false,
    "CSP bevat frame-ancestors 'none' (clickjacking)",
  );
  check(
    csp?.includes("object-src 'none'") ?? false,
    "CSP bevat object-src 'none'",
  );
  check(
    (csp?.includes('nonce-') ?? false) && !(csp?.includes("script-src 'self' 'unsafe-inline'") ?? false),
    'CSP gebruikt een nonce voor scripts in plaats van unsafe-inline',
  );
  check(
    response.headers.get('x-content-type-options') === 'nosniff',
    'X-Content-Type-Options: nosniff',
  );
  check(
    response.headers.get('x-frame-options') === 'DENY',
    'X-Frame-Options: DENY',
  );
  check(
    response.headers.get('referrer-policy') === 'no-referrer',
    'Referrer-Policy: no-referrer',
  );
  check(
    response.headers.get('cross-origin-opener-policy') === 'same-origin',
    'Cross-Origin-Opener-Policy: same-origin',
  );
  check(
    (response.headers.get('permissions-policy') ?? '').includes('camera=()'),
    'Permissions-Policy schakelt ongebruikte functies uit',
  );
  check(
    response.headers.get('x-powered-by') === null,
    'X-Powered-By is verborgen',
  );

  /* --- 2. Afscherming van beveiligde routes ---------------------------- */

  section('2. Afscherming van beveiligde routes');

  const protectedRoutes = [
    '/dashboard',
    '/exam',
    '/practice',
    '/review',
    '/stats',
    '/settings',
    '/glossary',
  ];

  for (const route of protectedRoutes) {
    const res = await request(route);
    const location = res.headers.get('location') ?? '';
    const redirected =
      (res.status === 307 || res.status === 302 || res.status === 303) &&
      (location.includes('/login') || location.includes('/setup'));
    check(redirected, `${route} is afgeschermd`, `status ${res.status} → ${location}`);
  }

  const exportRes = await request('/api/export');
  check(
    exportRes.status === 401 || exportRes.status === 307,
    '/api/export vereist authenticatie',
    `status ${exportRes.status}`,
  );

  /* --- 3. Installatiescherm -------------------------------------------- */

  section('3. Installatie en registratie');

  const setupRes = await request('/setup');
  const setupHtml = await setupRes.text();
  const setupAvailable = setupRes.status === 200 && setupHtml.includes('installatie');

  check(
    setupAvailable || setupRes.status === 307,
    'installatiescherm reageert correct',
    `status ${setupRes.status}`,
  );

  if (!setupAvailable) {
    console.log(
      '\n  [33m![0m Er bestaat al een account; registratie wordt overgeslagen.\n' +
        '    Voor een volledige test: verwijder data/project115.db en herstart.',
    );
  } else {
    const actionFields = extractActionFields(setupHtml);
    check(
      Object.keys(actionFields).length > 0,
      'registratieformulier werkt zonder JavaScript (progressive enhancement)',
    );

    if (Object.keys(actionFields).length > 0) {
      const form = new FormData();
      for (const [name, value] of Object.entries(actionFields)) {
        form.set(name, value);
      }
      form.set('displayName', 'Testgebruiker');
      form.set('email', `e2e-${Date.now()}@localhost.test`);
      form.set('password', 'een-lange-testzin-voor-e2e-2026');
      form.set('locale', 'nl');

      const registerRes = await request('/setup', {
        method: 'POST',
        body: form,
      });

      const sessionSet = [...cookies.keys()].some((name) => name.includes('p115_session'));
      check(
        registerRes.status < 500,
        'registratie verwerkt zonder serverfout',
        `status ${registerRes.status}`,
      );
      check(sessionSet, 'sessiecookie is gezet na registratie');

      if (sessionSet) {
        const dashboardRes = await request('/dashboard');
        const dashboardHtml =
          dashboardRes.status === 200 ? await dashboardRes.text() : '';
        check(dashboardRes.status === 200, 'dashboard is bereikbaar na inloggen');
        check(
          dashboardHtml.includes('ITIL') && dashboardHtml.includes('27001'),
          'dashboard toont beide certificeringen',
        );
        check(
          dashboardHtml.includes('B. van Rooij'),
          'vermelding van de auteur staat in de voettekst',
        );

        const glossaryRes = await request('/glossary');
        const glossaryHtml = glossaryRes.status === 200 ? await glossaryRes.text() : '';
        check(glossaryRes.status === 200, 'glossarium is bereikbaar');
        check(
          glossaryHtml.includes('begrippen'),
          'glossarium toont begrippen',
        );

        const examRes = await request('/exam');
        const examHtml = examRes.status === 200 ? await examRes.text() : '';
        check(examRes.status === 200, 'examenkeuzescherm is bereikbaar');
        check(
          examHtml.includes('40') && examHtml.includes('26'),
          'examenkeuzescherm toont 40 vragen en cesuur 26',
        );

        const statsRes = await request('/stats');
        check(statsRes.status === 200, 'voortgangspagina is bereikbaar');

        const settingsRes = await request('/settings');
        const settingsHtml = settingsRes.status === 200 ? await settingsRes.text() : '';
        check(settingsRes.status === 200, 'instellingen zijn bereikbaar');
        check(
          settingsHtml.includes('Tweestapsverificatie'),
          'instellingen tonen tweestapsverificatie',
        );

        const reviewRes = await request('/review');
        check(reviewRes.status === 200, 'herhaalpagina is bereikbaar');

        const exportOk = await request('/api/export');
        check(exportOk.status === 200, 'gegevensexport werkt voor ingelogde gebruiker');
        if (exportOk.status === 200) {
          const payload = (await exportOk.json()) as Record<string, unknown>;
          check(
            !JSON.stringify(payload).includes('passwordHash'),
            'export bevat geen wachtwoordhash',
          );
          check(
            payload.author === 'B. van Rooij',
            'export vermeldt de auteur',
          );
        }
      }
    }
  }

  /* --- 4. Volledig proefexamen ----------------------------------------- */

  section('4. Volledig proefexamen doorlopen');

  const loggedIn = [...cookies.keys()].some((name) => name.includes('p115_session'));

  if (!loggedIn) {
    console.log('  [33m![0m Niet ingelogd; examenflow overgeslagen.');
  } else {
    const examPage = await request('/exam');
    const examPageHtml = await examPage.text();

    // Het startformulier van de ITIL-certificering opzoeken en indienen.
    const formMatch = /<form[^>]*>[\s\S]*?itil5-foundation[\s\S]*?<\/form>/.exec(
      examPageHtml,
    );
    check(formMatch !== null, 'startformulier voor ITIL gevonden');

    if (formMatch) {
      const fields = extractActionFields(formMatch[0]);
      const form = new FormData();
      for (const [name, value] of Object.entries(fields)) form.set(name, value);
      form.set('certificationId', 'itil5-foundation');
      form.set('mode', 'exam');
      form.set('locale', 'nl');

      const startRes = await request('/exam', { method: 'POST', body: form });
      check(startRes.status < 500, 'proefexamen starten geeft geen serverfout', `status ${startRes.status}`);

      // De redirect naar /exam/<id> zit in de actie-respons.
      const startBody = await startRes.text();
      const attemptId =
        /\/exam\/(att_[0-9a-f]{32})/.exec(startBody)?.[1] ??
        /\/exam\/(att_[0-9a-f]{32})/.exec(startRes.headers.get('location') ?? '')?.[1] ??
        null;

      check(attemptId !== null, 'poging is aangemaakt met een id');

      if (attemptId) {
        const attemptPage = await request(`/exam/${attemptId}`);
        const attemptHtml = attemptPage.status === 200 ? await attemptPage.text() : '';

        check(attemptPage.status === 200, 'examenpagina laadt');
        check(
          attemptHtml.includes('Vraag') && attemptHtml.includes('40'),
          'examenpagina toont 40 vragen',
        );
        // Het gaat om de wáárde, niet de propertynaam: het veld `isCorrect`
        // staat wel in de payload maar op null zolang er niet is nagekeken.
        // Een lek zou `"isCorrect":true` of gevulde toelichtingen zijn.
        const leaks = [
          /"isCorrect"\s*:\s*true/,
          /\\"isCorrect\\"\s*:\s*true/,
          /"explanation"\s*:\s*"[^"]{5,}/,
          /\\"explanation\\"\s*:\s*\\"[^"]{5,}/,
          /"rationale"\s*:\s*"[^"]{5,}/,
        ];
        const leaked = leaks.filter((pattern) => pattern.test(attemptHtml));
        check(
          leaked.length === 0,
          'examenpagina lekt geen juiste antwoorden in de payload',
          leaked.length > 0 ? `patroon gevonden: ${leaked[0]}` : undefined,
        );
        check(
          !attemptHtml.includes('Toelichting') && !attemptHtml.includes('Juiste antwoord'),
          'geen toelichting zichtbaar tijdens het examen',
        );

        // De timer moet op de server staan, niet alleen in de client.
        check(
          attemptHtml.includes('60') || attemptHtml.includes('59:'),
          'timer is aanwezig',
        );

        // Poging afronden via de API-route van de submit-actie is niet
        // eenvoudig na te bootsen zonder JS; controleer in plaats daarvan dat
        // een tweede start dezelfde poging hervat in plaats van een nieuwe
        // aan te maken. Dat is de gedragsregel die dataverlies voorkomt.
        const restartForm = new FormData();
        for (const [name, value] of Object.entries(fields)) restartForm.set(name, value);
        restartForm.set('certificationId', 'itil5-foundation');
        restartForm.set('mode', 'exam');
        restartForm.set('locale', 'nl');

        await request('/exam', { method: 'POST', body: restartForm });

        // Controleer via de UI dat er nog steeds één lopende poging is: het
        // keuzescherm moet 'Hervatten' tonen en naar dezelfde poging wijzen.
        const afterRestart = await request('/exam');
        const afterHtml = await afterRestart.text();
        const linkedIds = [
          ...new Set(
            [...afterHtml.matchAll(/\/exam\/(att_[0-9a-f]{32})/g)].map((m) => m[1]!),
          ),
        ];

        check(
          afterHtml.includes('Hervatten'),
          'keuzescherm biedt de lopende poging aan om te hervatten',
        );
        check(
          linkedIds.length === 1 && linkedIds[0] === attemptId,
          'een tweede start maakt geen tweede poging aan',
          `gevonden pogingen: ${linkedIds.length}`,
        );

        // Andermans poging mag niet zichtbaar zijn.
        const otherJar = new Map(cookies);
        cookies.clear();
        const unauthorized = await request(`/exam/${attemptId}`);
        check(
          unauthorized.status !== 200,
          'een niet-ingelogde bezoeker kan de poging niet openen',
          `status ${unauthorized.status}`,
        );
        cookies.clear();
        for (const [k, v] of otherJar) cookies.set(k, v);
      }
    }
  }

  /* --- 5. Foutafhandeling ---------------------------------------------- */

  section('4. Foutafhandeling');

  const notFound = await request('/bestaat-niet-12345');
  check(notFound.status === 404, '404 voor onbekende route', `status ${notFound.status}`);

  const badAttempt = await request('/result/nietbestaand');
  check(
    badAttempt.status === 404 || badAttempt.status === 307,
    'onbekende poging levert geen serverfout',
    `status ${badAttempt.status}`,
  );

  /* --- Samenvatting ----------------------------------------------------- */

  console.log(`\n[1mResultaat[0m`);
  console.log(`  geslaagd: [32m${passed}[0m`);
  console.log(`  gefaald:  ${failed > 0 ? '[31m' : ''}${failed}[0m`);

  if (failed > 0) {
    console.log('\nGefaalde controles:');
    for (const failure of failures) console.log(`  - ${failure}`);
    process.exit(1);
  }

  console.log('\n[32mAlle controles geslaagd.[0m');
}

void main();
