import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth/session';
import { needsSetup } from '@/app/actions/auth';

// Beslist per request waar de gebruiker heen moet; prerenderen zou die
// beslissing in de build vastleggen.
export const dynamic = 'force-dynamic';

/**
 * Instap. Stuurt door naar de eerste installatie, het inlogscherm of het
 * dashboard, afhankelijk van de staat van de applicatie.
 */
export default async function Home() {
  if (await needsSetup()) redirect('/setup');

  const session = await getSession();
  if (!session) redirect('/login');
  if (!session.mfaSatisfied) redirect('/login/verify');

  redirect('/dashboard');
}
