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

  // Ensure base URL has trailing slash for correct path resolution
  const base = import.meta.env.BASE_URL || '/';
  const baseWithSlash = base.endsWith('/') ? base : `${base}/`;

  // Preload all cities once on mount
  useEffect(() => {
    let cancelled = false;
    if (all) return;

    const url = `${baseWithSlash}cities.json`;

    fetch(url)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) setAll(data as string[]);
      })
      .catch(() => {
        // Silently fail - error will be shown when user searches
      });

    return () => {
      cancelled = true;
    };
  }, [all, baseWithSlash]);

  // Search cities based on query
  useEffect(() => {
    // Require minimum 2 characters
    if (query.length < 2) {
      setCities([]);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        // In development, try the mock API endpoint first
        if (import.meta.env.DEV) {
          try {
            const url = `/cities?q=${encodeURIComponent(query)}`;
            const res = await fetch(url);

            if (res.ok) {
              const data = await res.json();
              if (!cancelled) {
                setCities(data);
                setLoading(false);
              }
              return;
            }
          } catch {
            // Fall through to static data
          }
        }

        // Production or fallback: filter preloaded static data
        if (all) {
          const q = query.toLowerCase();
          const filtered = all
            .filter((n) => n.toLowerCase().includes(q))
            .slice(0, 20);
          if (!cancelled) {
            setCities(filtered);
          }
        } else {
          // Still waiting for static data to load
          if (!cancelled) {
            setCities([]);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error('Failed to load cities'));
          setCities([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [query, all]);

  return { cities, loading, error };
};
