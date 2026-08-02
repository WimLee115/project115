import { useEffect, useState } from 'react';

import { useApp } from '@/app/app-state';
import { verifyPin } from '@/lib/lock';

/**
 * Vergrendelscherm.
 *
 * Een eigen cijfertoetsenbord in plaats van het systeemtoetsenbord. Dat is geen
 * kosmetiek: het toetsenbord van Android schuift over de onderste helft van het
 * scherm en verplaatst zich bij elke druk, waardoor je bij het invoeren van een
 * pincode naar je eigen vingers moet kijken in plaats van naar de bolletjes.
 * Met vaste toetsen op vaste plekken kun je blind invoeren.
 */

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
const MAX_LENGTH = 8;

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const { t } = useApp();

  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [waitSeconds, setWaitSeconds] = useState(0);

  // Aftellen tijdens een blokkade, zodat je ziet hoe lang je nog moet wachten
  // in plaats van blind opnieuw te proberen.
  useEffect(() => {
    if (waitSeconds <= 0) return;
    const timer = window.setTimeout(() => setWaitSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [waitSeconds]);

  const blocked = waitSeconds > 0;

  const submit = async (candidate: string) => {
    setChecking(true);
    const result = await verifyPin(candidate);
    setChecking(false);

    if (result.ok) {
      onUnlock();
      return;
    }

    setPin('');
    if (result.waitSeconds > 0) {
      setWaitSeconds(result.waitSeconds);
      setError(t('lock.tooMany'));
    } else {
      setError(t('lock.wrong'));
    }
  };

  const press = (digit: string) => {
    if (blocked || checking) return;
    setError(null);

    const next = (pin + digit).slice(0, MAX_LENGTH);
    setPin(next);

    // Vier cijfers is het minimum; korter kan geen geldige pincode zijn, dus
    // pas vanaf daar heeft automatisch controleren zin.
    if (next.length >= 4) void submit(next);
  };

  return (
    <div
      className="grid min-h-dvh place-items-center px-6"
      style={{ paddingTop: 'var(--safe-top)', paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="w-full max-w-xs text-center">
        <div
          className="mx-auto grid h-14 w-14 place-items-center rounded-2xl"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 10V7a5 5 0 0 1 10 0v3"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <rect
              x="4"
              y="10"
              width="16"
              height="10"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.75"
            />
          </svg>
        </div>

        <h1 className="mt-4 text-xl font-semibold">{t('lock.title')}</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          {t('lock.prompt')}
        </p>

        <div className="mt-7 flex justify-center gap-2.5" aria-hidden="true">
          {Array.from({ length: Math.max(4, pin.length) }, (_, index) => (
            <span
              key={index}
              className="h-3 w-3 rounded-full transition-colors"
              style={{
                background:
                  index < pin.length ? 'var(--accent)' : 'var(--surface-hover)',
                border: `1px solid ${index < pin.length ? 'var(--accent)' : 'var(--border-strong)'}`,
              }}
            />
          ))}
        </div>

        <p
          className="mt-4 min-h-[1.25rem] text-sm"
          role="alert"
          style={{ color: error ? 'var(--danger)' : 'transparent' }}
        >
          {blocked ? `${t('lock.tooMany')} (${waitSeconds}s)` : (error ?? '·')}
        </p>

        <div className="mt-2 grid grid-cols-3 gap-3">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className="p115-btn p115-btn-secondary h-14 text-lg tabular-nums"
              onClick={() => press(key)}
              disabled={blocked || checking}
            >
              {key}
            </button>
          ))}

          <span />

          <button
            type="button"
            className="p115-btn p115-btn-secondary h-14 text-lg tabular-nums"
            onClick={() => press('0')}
            disabled={blocked || checking}
          >
            0
          </button>

          <button
            type="button"
            className="p115-btn p115-btn-ghost h-14"
            onClick={() => {
              setError(null);
              setPin((value) => value.slice(0, -1));
            }}
            disabled={blocked || checking || pin.length === 0}
            aria-label={t('common.remove')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
              <path
                d="M12 10l4 4m0-4l-4 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <p className="mt-8 text-xs leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
          {t('lock.forgot')}
        </p>
      </div>
    </div>
  );
}
