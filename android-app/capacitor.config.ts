import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Project115 — Capacitor-configuratie.
 *
 * De app draait volledig offline: `server` wijst nergens heen, alle assets
 * zitten in de APK. Daarmee is er ook geen netwerkverkeer om te beveiligen —
 * de studiegegevens verlaten het toestel alleen wanneer je zelf exporteert.
 */
const config: CapacitorConfig = {
  appId: 'nl.vanrooij.project115',
  appName: 'Project115',
  webDir: 'dist',

  android: {
    // Zonder mixed content en zonder debugbare WebView in release-builds.
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },

  plugins: {
    StatusBar: {
      // De app tekent zelf achter de statusbalk; zie de safe-area-insets in
      // globals.css.
      overlaysWebView: false,
      style: 'DEFAULT',
    },
  },
};

export default config;
