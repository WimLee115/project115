import { NextResponse, type NextRequest } from 'next/server';

/**
 * Security headers, per request gezet.
 *
 * De Content-Security-Policy krijgt een nonce die per request uniek is. Die
 * nonce geeft Next.js door aan zijn eigen inline scripts, waardoor we
 * 'unsafe-inline' voor scripts kunnen weglaten — de belangrijkste verdediging
 * tegen XSS.
 */

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';

  const csp = [
    `default-src 'self'`,
    // 'strict-dynamic' laat toe dat een script met geldige nonce zelf scripts
    // laadt; browsers die het niet kennen vallen terug op de nonce/self-lijst.
    // In development heeft de Turbopack-runtime eval nodig.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    // Tailwind injecteert stijlen als <style>-element; een nonce daarop is met
    // Next.js niet betrouwbaar door te geven, vandaar unsafe-inline voor CSS.
    // Dat is aanzienlijk minder riskant dan inline scripts toestaan.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self' data:`,
    // De app praat alleen met zichzelf; in dev ook met de HMR-websocket.
    `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `manifest-src 'self'`,
    // Blokkeert per ongeluk achtergebleven http://-resources.
    ...(isDev ? [] : [`upgrade-insecure-requests`]),
  ].join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  // Schakelt browserfuncties uit die deze app niet gebruikt.
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  );
  // Isolatie tegen cross-origin-lekken (Spectre-klasse).
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  if (!isDev) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains',
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Alles behalve statische assets — die hebben geen nonce nodig en het
     * scheelt werk per request.
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
