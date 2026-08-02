import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * Navigatie.
 *
 * Bewust geen routerbibliotheek. De app heeft tien routes en drie daarvan
 * hebben een parameter; een bibliotheek zou hier vooral gewicht toevoegen en
 * een tweede manier van denken over iets wat in vijftig regels past. Dat is
 * dezelfde afweging als bij de tweetaligheid in de webversie, waar ook bewust
 * geen vertaalbibliotheek is gebruikt.
 *
 * Hash-routing en geen history-API: de WebView laadt de app vanaf een
 * bestandspad, waar padgebaseerde routes bij het terugkeren uit de achtergrond
 * niet betrouwbaar oplossen. Een hash blijft altijd binnen dezelfde pagina.
 */

export interface Route {
  path: string;
  /** Padsegmenten na de route, bijv. het poging-id in `#/result/att_123`. */
  params: string[];
}

interface RouterValue {
  route: Route;
  navigate: (path: string, options?: { replace?: boolean }) => void;
  back: () => void;
  /** Aantal keer dat er binnen de app is genavigeerd; 0 betekent beginscherm. */
  depth: number;
}

const RouterContext = createContext<RouterValue | null>(null);

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, '');
  const clean = raw.split('?')[0] ?? '';
  const segments = clean.split('/').filter((segment) => segment.length > 0);

  if (segments.length === 0) return { path: '/', params: [] };
  return {
    path: `/${segments[0]}`,
    params: segments.slice(1).map(decodeURIComponent),
  };
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseHash());
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback(
    (path: string, options: { replace?: boolean } = {}) => {
      const target = path.startsWith('#') ? path : `#${path}`;
      if (window.location.hash === target) return;

      if (options.replace) {
        window.location.replace(target);
        // `replace` vuurt geen hashchange wanneer alleen de hash wijzigt in
        // sommige WebView-versies; daarom hier ook zelf bijwerken.
        setRoute(parseHash());
      } else {
        window.location.hash = target;
        setDepth((value) => value + 1);
      }
    },
    [],
  );

  const back = useCallback(() => {
    if (depth > 0) {
      setDepth((value) => Math.max(0, value - 1));
      window.history.back();
    } else {
      window.location.hash = '#/';
    }
  }, [depth]);

  const value = useMemo<RouterValue>(
    () => ({ route, navigate, back, depth }),
    [route, navigate, back, depth],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const value = useContext(RouterContext);
  if (!value) throw new Error('useRouter buiten een RouterProvider gebruikt.');
  return value;
}

/**
 * Link die als knop werkt.
 *
 * Een echte `<a href="#/...">` zou ook werken, maar dan mist de app het
 * onderscheid tussen vooruit navigeren en terug — en dat onderscheid heeft de
 * hardwareknop 'terug' op Android wel nodig.
 */
export function Link({
  to,
  children,
  className,
  replace = false,
  onNavigate,
  ...rest
}: {
  to: string;
  children: ReactNode;
  className?: string;
  replace?: boolean;
  onNavigate?: () => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) {
  const { navigate } = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onNavigate?.();
        navigate(to, { replace });
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
