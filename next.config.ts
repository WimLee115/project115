import type { NextConfig } from 'next';

/**
 * Project115 — Next.js configuratie.
 *
 * Security-relevante keuzes:
 * - `output: 'standalone'` levert een minimale runtime voor de Docker-image
 *   (geen dev-dependencies, kleiner aanvalsoppervlak).
 * - `poweredByHeader: false` verbergt de `X-Powered-By`-header.
 * - De overige security headers (CSP met nonce, HSTS, frame-ancestors) worden
 *   per request in `src/middleware.ts` gezet, omdat de CSP-nonce per request
 *   uniek moet zijn en dus niet statisch kan.
 */
const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,

  // better-sqlite3 is een native module en mag niet gebundeld worden.
  serverExternalPackages: ['better-sqlite3', '@node-rs/argon2'],

  experimental: {
    // Beperkt de hoeveelheid data die een Server Action mag accepteren.
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
};

export default nextConfig;
