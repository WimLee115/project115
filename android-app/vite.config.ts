import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Project115 — buildconfiguratie voor twee verpakkingen van dezelfde app.
 *
 * De vragenbank blijft in `../content` staan: één bron van waarheid voor zowel
 * de webversie als deze app. Een kopie zou onvermijdelijk gaan afwijken, en een
 * vraag die op je telefoon anders luidt dan op je pc is erger dan geen app.
 *
 * Twee modi:
 * - standaard → `dist/`, wat Capacitor in de APK verpakt;
 * - `--mode web` → `dist-web/`, wat op een gewone webserver komt te staan.
 *
 * Ze verschillen alleen in uitvoermap en in wat `scripts/build-web.ts` er
 * daarna aan toevoegt (manifest en service worker). De code erin is identiek;
 * twee builds die inhoudelijk uiteenlopen zouden betekenen dat je twee keer moet
 * testen.
 *
 * `base: './'` geldt voor allebei. Capacitor laadt de app vanaf een
 * bestandspad in de WebView, waar absolute paden niet oplossen; op het web
 * maakt het de app onafhankelijk van de submap waarin hij komt te staan.
 */
const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': here('./src'),
      '@content': here('../content'),
    },
  },
  server: {
    // Nodig om tijdens ontwikkelen buiten de projectmap te mogen lezen.
    fs: { allow: [here('.'), here('../content')] },
  },
  build: {
    outDir: mode === 'web' ? 'dist-web' : mode === 'single' ? '.single-build' : 'dist',
    emptyOutDir: true,
    // De WebView op Android 8+ ondersteunt moderne syntax; kleinere bundel,
    // minder transpilatie.
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    // Een bestand dat in de pagina zelf komt te staan, mag niets meer inladen.
    ...(mode === 'single' ? { assetsInlineLimit: Number.MAX_SAFE_INTEGER } : {}),
    rollupOptions: {
      output:
        mode === 'single'
          ? { inlineDynamicImports: true }
          : {
              // De vragenbank is groot en verandert zelden; als losse chunk
              // hoeft hij niet mee te veranderen met elke wijziging aan de app
              // zelf.
              manualChunks: (id: string) =>
                id.replace(/\\/g, '/').includes('/content/') ? 'content' : undefined,
            },
    },
  },
}));
