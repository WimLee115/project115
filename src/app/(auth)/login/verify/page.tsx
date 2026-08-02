import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { verifyTotp } from '@/app/actions/auth';
import { getSession } from '@/lib/auth/session';
import { TotpForm } from '@/components/auth-forms';
import { Card } from '@/components/ui';

export const metadata: Metadata = { title: 'Verificatie' };

/** Tweede stap: de code uit de authenticator-app. */
export default async function VerifyPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  if (session.mfaSatisfied) redirect('/dashboard');

  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold">Tweestapsverificatie</h2>
      <TotpForm
        action={verifyTotp}
        labels={{
          code: 'Verificatiecode',
          prompt: 'Voer de zescijferige code uit je authenticator-app in.',
          submit: 'Verifiëren',
        }}
      />
    </Card>
  );
}
