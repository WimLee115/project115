import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { login, needsSetup } from '@/app/actions/auth';
import { getSession } from '@/lib/auth/session';
import { LoginForm } from '@/components/auth-forms';
import { Card } from '@/components/ui';

export const metadata: Metadata = { title: 'Inloggen' };

// Leest de sessie en de installatiestatus; die mogen niet in de build bevriezen.
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await needsSetup()) redirect('/setup');

  const session = await getSession();
  if (session?.mfaSatisfied) redirect('/dashboard');
  if (session && !session.mfaSatisfied) redirect('/login/verify');

  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold">Inloggen</h2>
      <LoginForm
        action={login}
        labels={{
          email: 'E-mailadres',
          password: 'Wachtwoord',
          submit: 'Inloggen',
        }}
      />
    </Card>
  );
}
