'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

/**
 * Hoofdnavigatie.
 *
 * Op smalle schermen klapt het menu in; tijdens een examen is de navigatie
 * helemaal afwezig (die route heeft een eigen layout), zodat je niet per
 * ongeluk wegklikt.
 */

export interface NavItem {
  href: string;
  label: string;
  badge?: number;
}

export function MainNav({
  items,
  userName,
  logoutAction,
  logoutLabel,
}: {
  items: NavItem[];
  userName: string;
  logoutAction: () => Promise<void>;
  logoutLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur"
      style={{
        background: 'color-mix(in srgb, var(--surface) 88%, transparent)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold">
          <span
            className="grid h-8 w-8 place-items-center rounded-lg text-xs font-bold"
            style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
            aria-hidden="true"
          >
            115
          </span>
          <span className="hidden sm:inline">Project115</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Hoofdnavigatie">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className="relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              style={
                isActive(item.href)
                  ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              {item.label}
              {item.badge && item.badge > 0 ? (
                <span
                  className="ml-1.5 rounded-full px-1.5 py-0.5 text-[0.6875rem] font-semibold tabular-nums"
                  style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-sm sm:inline" style={{ color: 'var(--text-muted)' }}>
            {userName}
          </span>
          <form action={logoutAction} className="hidden md:block">
            <button type="submit" className="p115-btn p115-btn-ghost px-2.5 py-1.5 text-sm">
              {logoutLabel}
            </button>
          </form>
          <button
            type="button"
            className="p115-btn p115-btn-ghost px-2.5 py-1.5 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d={open ? 'M5 5l10 10M15 5L5 15' : 'M3 6h14M3 10h14M3 14h14'}
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t px-4 py-2 md:hidden"
          style={{ borderColor: 'var(--border)' }}
          aria-label="Hoofdnavigatie"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium"
              style={
                isActive(item.href)
                  ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              {item.label}
              {item.badge && item.badge > 0 ? (
                <span className="tabular-nums">{item.badge}</span>
              ) : null}
            </Link>
          ))}
          <form action={logoutAction} className="mt-1 border-t pt-1" style={{ borderColor: 'var(--border)' }}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {logoutLabel}
            </button>
          </form>
        </nav>
      ) : null}
    </header>
  );
}
