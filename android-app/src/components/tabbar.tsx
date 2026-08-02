import type { ReactNode } from 'react';

import { useRouter } from '@/lib/router';

/**
 * Onderbalk met de vijf hoofdschermen.
 *
 * Vijf, niet zeven zoals de webversie. Instellingen en het examenrapport zijn
 * geen bestemmingen waar je tijdens het studeren tussen heen en weer springt;
 * die bereik je vanaf het dashboard. Meer dan vijf tabs maakt de doelen zo smal
 * dat mistikken de norm wordt.
 */

interface Tab {
  path: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function TabBar({
  labels,
  dueCount,
}: {
  labels: {
    dashboard: string;
    exam: string;
    practice: string;
    review: string;
    glossary: string;
  };
  dueCount: number;
}) {
  const { route, navigate } = useRouter();

  const tabs: Tab[] = [
    {
      path: '/',
      label: labels.dashboard,
      icon: (
        <svg {...iconProps}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V20h14V9.5" />
        </svg>
      ),
    },
    {
      path: '/exam',
      label: labels.exam,
      icon: (
        <svg {...iconProps}>
          <path d="M12 3a9 9 0 1 1-9 9" />
          <path d="M12 7v5l3 2" />
        </svg>
      ),
    },
    {
      path: '/practice',
      label: labels.practice,
      icon: (
        <svg {...iconProps}>
          <path d="M4 5h16v12H4z" />
          <path d="M8 21h8" />
          <path d="M9 10.5l2 2 4-4" />
        </svg>
      ),
    },
    {
      path: '/review',
      label: labels.review,
      icon: (
        <svg {...iconProps}>
          <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8" />
          <path d="M20 4v4h-4" />
          <path d="M20 12a8 8 0 0 1-13.7 5.6L4 16" />
          <path d="M4 20v-4h4" />
        </svg>
      ),
      ...(dueCount > 0 ? { badge: dueCount } : {}),
    },
    {
      path: '/glossary',
      label: labels.glossary,
      icon: (
        <svg {...iconProps}>
          <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" />
          <path d="M5 17a3 3 0 0 1 3-3h11" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="p115-tabbar" aria-label="Hoofdnavigatie">
      {tabs.map((tab) => {
        const active = route.path === tab.path;
        return (
          <button
            key={tab.path}
            type="button"
            className="p115-tab"
            data-active={active}
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(tab.path, { replace: true })}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge ? (
              <span className="p115-tab-badge">{tab.badge > 99 ? '99+' : tab.badge}</span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
