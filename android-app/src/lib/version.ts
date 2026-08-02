/**
 * Versienummer van de app.
 *
 * Los van `package.json` omdat de app niet met een bundler-truc aan een
 * bestand buiten `src/` wil hangen, en met een test die de twee vergelijkt
 * (`test/version.test.ts`) — zodat het niet stilletjes uit elkaar loopt.
 *
 * Deze waarde hoort ook gelijk te zijn aan `versionName` in
 * `android/app/build.gradle` zodra de Android-map is gegenereerd.
 */
export const APP_VERSION = '1.1.1';

/** Waar de nieuwste versie en de broncode staan. */
export const SOURCE_URL = 'https://github.com/wimlee115';

/**
 * Waar een gebruiker een fout of een voorstel kwijt kan.
 *
 * Rechtstreeks naar het formulier voor een nieuwe melding, niet naar de lijst
 * met bestaande. Wie een fout in een vraag ziet, wil die melden en niet eerst
 * door andermans issues bladeren.
 */
export const REPORT_URL = 'https://github.com/WimLee115/project115/issues/new/choose';
