import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { register, needsSetup } from '@/app/actions/auth';
import { RegisterForm } from '@/components/auth-forms';
import { Card } from '@/components/ui';

export const metadata: Metadata = { title: 'Eerste installatie' };

/**
 * Nooit prerenderen. Zonder deze regel evalueert Next.js `needsSetup()` tijdens
 * de build en bevriest het resultaat: bestond er toen nog geen account, dan
 * blijft dit scherm bereikbaar nadat er wél een is aangemaakt. Dat is precies
 * de situatie die je niet wilt bij een registratiescherm.
 */
export const dynamic = 'force-dynamic';

/**
 * Eerste installatie. Alleen bereikbaar zolang er nog geen account bestaat;
 * daarna stuurt deze pagina door naar het inlogscherm.
 */
export default async function SetupPage() {
  if (!(await needsSetup())) redirect('/login');

  return (
    <Card>
      <h2 className="text-base font-semibold">Eerste installatie</h2>
      <p className="mb-4 mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
        Maak je account aan. Dit doe je maar één keer — de hub is voor één
        gebruiker en je gegevens blijven lokaal.
      </p>
      <RegisterForm
        action={register}
        labels={{
          name: 'Naam',
          email: 'E-mailadres',
          password: 'Wachtwoord',
          submit: 'Account aanmaken',
        }}
      />
    </Card>
  );
}
