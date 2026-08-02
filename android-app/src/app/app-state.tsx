import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getTranslator, type Translator } from '@/lib/i18n';
import type { Locale } from '@/lib/content';
import { countDueCards } from '@/lib/srs';
import {
  getSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  type AppSettings,
} from '@/lib/store';

/**
 * Gedeelde app-toestand: instellingen, taal en het aantal openstaande
 * herhalingen.
 *
 * Alleen deze drie. Alles wat een scherm zelf kan ophalen, haalt het zelf op —
 * een centrale winkel waar elk scherm uit put, wordt onvermijdelijk de plek
 * waar niemand meer weet wie wat wanneer bijwerkt.
 */

interface AppState {
  settings: AppSettings;
  locale: Locale;
  t: Translator;
  ready: boolean;
  dueCount: number;
  update: (patch: Partial<AppSettings>) => Promise<void>;
  /** Opnieuw tellen na een herhaalsessie of een import. */
  refreshDue: () => Promise<void>;
}

const AppStateContext = createContext<AppState | null>(null);

/** Zet het thema op het document, zodat de CSS-variabelen omschakelen. */
function applyTheme(theme: AppSettings['theme']): void {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const stored = await getSettings();
      if (cancelled) return;
      setSettings(stored);
      applyTheme(stored.theme);
      setReady(true);

      const due = await countDueCards();
      if (!cancelled) setDueCount(due);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(async (patch: Partial<AppSettings>) => {
    // Vanuit de laatst opgeslagen versie werken in plaats van vanuit de state:
    // twee instellingen die vlak na elkaar wijzigen mogen elkaar niet wissen.
    const current = await getSettings();
    const next = { ...current, ...patch };
    await saveSettings(next);
    setSettings(next);
    if (patch.theme !== undefined) applyTheme(next.theme);
  }, []);

  const refreshDue = useCallback(async () => {
    setDueCount(await countDueCards());
  }, []);

  const value = useMemo<AppState>(
    () => ({
      settings,
      locale: settings.locale,
      t: getTranslator(settings.locale),
      ready,
      dueCount,
      update,
      refreshDue,
    }),
    [settings, ready, dueCount, update, refreshDue],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useApp(): AppState {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('useApp buiten een AppStateProvider gebruikt.');
  return value;
}
