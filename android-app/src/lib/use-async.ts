import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Gegevens ophalen uit de lokale opslag.
 *
 * Alles in deze app komt van het toestel zelf, dus laadtijden zijn kort en er
 * is geen netwerk dat kan falen. Wat wel kan gebeuren: een scherm wordt
 * verlaten terwijl de opslag nog antwoordt. Daarom de `active`-vlag — zonder
 * die controle zet een laat antwoord state op een component die er niet meer
 * is, en dat is precies het soort fout dat pas maanden later opvalt.
 */

export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  /** Opnieuw uitvoeren, bijvoorbeeld na het opslaan van een antwoord. */
  reload: () => void;
}

export function useAsync<T>(
  load: () => Promise<T>,
  deps: unknown[] = [],
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    let active = true;
    setLoading(true);

    loadRef.current().then(
      (result) => {
        if (!active) return;
        setData(result);
        setError(null);
        setLoading(false);
      },
      (cause: unknown) => {
        if (!active) return;
        setError(cause instanceof Error ? cause : new Error(String(cause)));
        setLoading(false);
      },
    );

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((value) => value + 1), []);

  return { data, error, loading, reload };
}
