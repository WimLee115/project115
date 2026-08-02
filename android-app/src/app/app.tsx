import { useEffect, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

import { TabBar } from '@/components/tabbar';
import { Loading } from '@/components/ui';
import { cleanupStaleAttempts } from '@/lib/exam';
import { hasPin } from '@/lib/lock';
import { useRouter } from '@/lib/router';

import { useApp } from './app-state';
import { DashboardScreen } from '@/screens/dashboard';
import { ExamSetupScreen } from '@/screens/exam-setup';
import { ExamScreen } from '@/screens/exam';
import { PracticeSetupScreen } from '@/screens/practice-setup';
import { PracticeScreen } from '@/screens/practice';
import { ReviewScreen } from '@/screens/review';
import { GlossaryScreen } from '@/screens/glossary';
import { StatsScreen } from '@/screens/stats';
import { SettingsScreen } from '@/screens/settings';
import { ResultScreen } from '@/screens/result';
import { LockScreen } from '@/screens/lock';

/**
 * De schil om alle schermen heen.
 *
 * Drie dingen worden hier geregeld die geen enkel scherm zelf hoort te weten:
 * welke route welk scherm is, wanneer de app vergrendeld staat, en wat de
 * terugknop van Android doet.
 */

/** Routes waar de onderbalk in de weg zit omdat je ergens middenin zit. */
const FULL_SCREEN_ROUTES = new Set(['/exam', '/practice', '/result']);

function isRunningSession(path: string, params: string[]): boolean {
  // `#/exam` is het instelscherm, `#/exam/att_...` het lopende examen.
  return FULL_SCREEN_ROUTES.has(path) && params.length > 0;
}

export function App() {
  const { ready, t, dueCount, settings } = useApp();
  const { route, back, depth } = useRouter();
  const [locked, setLocked] = useState<boolean | null>(null);

  // Pogingen die nooit zijn ingeleverd afronden, zodat een weggeklikt examen
  // niet eeuwig als 'bezig' blijft staan en een nieuwe start blokkeert.
  useEffect(() => {
    if (!ready) return;
    void cleanupStaleAttempts();
  }, [ready]);

  useEffect(() => {
    void hasPin().then(setLocked);
  }, []);

  // Vergrendelen zodra de app naar de achtergrond gaat, als dat aan staat.
  useEffect(() => {
    if (!settings.pin || !settings.lockOnBackground) return;
    if (!Capacitor.isNativePlatform()) return;

    const handle = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) setLocked(true);
    });

    return () => {
      void handle.then((listener) => listener.remove());
    };
  }, [settings.pin, settings.lockOnBackground]);

  // De hardwareknop 'terug': binnen de app terug, en op het beginscherm de app
  // verlaten. Zonder dit sluit één druk op terug de hele app, ook midden in een
  // examen.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handle = CapacitorApp.addListener('backButton', () => {
      if (depth > 0 || route.path !== '/') {
        back();
      } else {
        void CapacitorApp.exitApp();
      }
    });

    return () => {
      void handle.then((listener) => listener.remove());
    };
  }, [back, depth, route.path]);

  if (!ready || locked === null) {
    return (
      <div className="p115-app">
        <Loading />
      </div>
    );
  }

  if (locked) {
    return <LockScreen onUnlock={() => setLocked(false)} />;
  }

  const [first] = route.params;
  const immersive = isRunningSession(route.path, route.params);

  const screen = (() => {
    switch (route.path) {
      case '/':
        return <DashboardScreen />;

      case '/exam':
        return first ? <ExamScreen attemptId={first} /> : <ExamSetupScreen />;

      case '/practice':
        return first ? <PracticeScreen attemptId={first} /> : <PracticeSetupScreen />;

      case '/review':
        return <ReviewScreen />;

      case '/glossary':
        return <GlossaryScreen />;

      case '/stats':
        return <StatsScreen certificationId={first ?? null} />;

      case '/settings':
        return <SettingsScreen />;

      case '/result':
        return first ? (
          <ResultScreen attemptId={first} />
        ) : (
          <DashboardScreen />
        );

      default:
        // Een onbekende route is bijna altijd een verouderde link uit de
        // geschiedenis; terug naar het dashboard is dan het minst verrassend.
        return <DashboardScreen />;
    }
  })();

  return (
    <div className="p115-app">
      <main className={immersive ? 'p115-immersive px-4' : 'p115-scroll px-4'}>{screen}</main>

      {immersive ? null : (
        <TabBar
          labels={{
            dashboard: t('nav.dashboard'),
            exam: t('nav.exam'),
            practice: t('nav.practice'),
            review: t('nav.review'),
            glossary: t('nav.glossary'),
          }}
          dueCount={settings.showDueBadge ? dueCount : 0}
        />
      )}
    </div>
  );
}
