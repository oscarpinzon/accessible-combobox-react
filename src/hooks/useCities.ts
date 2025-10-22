import { useEffect, useState } from 'react';

export interface UseCitiesResult {
  cities: string[];
  loading: boolean;
  error: Error | null;
}

export const useCities = (query: string): UseCitiesResult => {
  const [all, setAll] = useState<string[] | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // For Github Pages, respect the repo base path
  const base = import.meta.env.BASE_URL || '/';

  // Preload static data once (for fallback + client-side filtering)
  useEffect(() => {
    let cancelled = false;
    if (all) return;

    fetch(`${base}cities.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) setAll(data as string[]);
      })
      .catch(() => {
        /* ignore, we can still rely on dev route */
      });

    return () => {
      cancelled = true;
    };
  }, [all, base]);

  useEffect(() => {
    // Don't fetch if query is too short
    if (query.length < 2) {
      setCities([]);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try dev mock endpoint first (works locally)
        const url = `${base}cities?q=${encodeURIComponent(query)}`;
        const res = await fetch(url);

        if (res.ok) {
          const data = await res.json(); // expects array of strings
          if (!cancelled) setCities(data);
          return;
        }

        // Fallback to static JSON (Pages/prod)
        if (all) {
          const q = query.toLowerCase();
          const filtered = all
            .filter((n) => n.toLowerCase().includes(q))
            .slice(0, 20);
          if (!cancelled) setCities(filtered);
          return;
        }

        throw new Error(`HTTP ${res.status}`);
      } catch (e) {
        // Final fallback if everything fails
        if (all) {
          const q = query.toLowerCase();
          const filtered = all
            .filter((n) => n.toLowerCase().includes(q))
            .slice(0, 20);
          if (!cancelled) setCities(filtered);
        } else {
          if (!cancelled) {
            setError(e instanceof Error ? e : new Error('Unknown error'));
            setCities([]);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [query, all, base]);

  return { cities, loading, error };
};
