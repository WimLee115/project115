import { NextResponse } from 'next/server';

/**
 * Health-endpoint voor de reverse proxy en Docker's healthcheck.
 *
 * Geeft altijd 200 zolang de server draait. Bewust géén databasecontrole: dit
 * endpoint is niet geauthenticeerd, en een foutmelding zou informatie over de
 * interne staat prijsgeven aan iedereen die het aanroept. De inhoud blijft
 * daarom minimaal.
 *
 * Een eigen endpoint is nodig omdat de gewone pagina's redirecten afhankelijk
 * van de sessie en de installatiestatus: `/login` geeft 307 wanneer er nog geen
 * account bestaat, en Caddy beschouwt alles buiten 2xx als een ongezonde
 * upstream.
 */
export const dynamic = 'force-dynamic';

export function GET() {
  return new NextResponse('ok', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
