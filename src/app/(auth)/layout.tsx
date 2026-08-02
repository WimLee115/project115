import type { ReactNode } from 'react';

/** Gecentreerde, afleidingsvrije opmaak voor de inlog- en installatieschermen. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl text-lg font-bold"
            style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
            aria-hidden="true"
          >
            115
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Project115</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            ITIL Foundation (Version 5) &middot; EXIN ISO/IEC 27001 Foundation
          </p>
        </div>

        {children}

        <p className="mt-8 text-center text-xs" style={{ color: 'var(--text-subtle)' }}>
          Ontwikkeld door B. van Rooij
        </p>
      </div>
    </main>
  );
}
