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
export const APP_VERSION = '1.0.0';

/** Waar de nieuwste versie en de broncode staan. */
export const SOURCE_URL = 'https://github.com/wimlee115';
