import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { requireUser, getSession } from '@/lib/auth/session';
import { getTranslator } from '@/lib/i18n';
import { countDueCards } from '@/lib/srs';
import { logout } from '@/app/actions/auth';
import { MainNav } from '@/components/nav';

/**
 * Layout voor alles achter de login.
 *
 * De sessiecontrole staat hier één keer, zodat elke onderliggende pagina er
 * zeker van kan zijn dat er een gebruiker is. Een pagina die dit zelf zou
 * moeten regelen, is een pagina die het een keer vergeet.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireUser();

  if (!session) {
    const partial = await getSession();
    redirect(partial ? '/login/verify' : '/login');
  }

  const t = getTranslator(session.user.locale);
  const dueCount = await countDueCards(session.user.id);

  const items = [
    { href: '/dashboard', label: t('nav.dashboard') },
    { href: '/exam', label: t('nav.exam') },
    { href: '/practice', label: t('nav.practice') },
    { href: '/review', label: t('nav.review'), badge: dueCount },
    { href: '/glossary', label: t('nav.glossary') },
    { href: '/stats', label: t('nav.stats') },
    { href: '/settings', label: t('nav.settings') },
  ];

  return (
    <div className="min-h-dvh">
      <MainNav
        items={items}
        userName={session.user.displayName}
        logoutAction={logout}
        logoutLabel={t('nav.logout')}
      />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer
        className="mx-auto max-w-6xl px-4 pb-8 pt-4 text-center text-xs"
        style={{ color: 'var(--text-subtle)' }}
      >
        {t('app.author')}
      </footer>
    </div>
  );
}
