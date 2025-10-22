import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { useCities } from './useCities';

const allCities = ['Vancouver', 'Victoria', 'Toronto', 'Montreal', 'Calgary'];

const server = setupServer(
  // Mock cities.json endpoint
  http.get('/cities.json', () => {
    return HttpResponse.json(allCities);
  }),
  // Mock query endpoint
  http.get('/cities', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.toLowerCase() || '';
    const filtered = allCities
      .filter((city) => city.toLowerCase().includes(query))
      .slice(0, 20);
    return HttpResponse.json(filtered);
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useCities', () => {
  it('should not fetch when query is less than 2 characters', async () => {
    const { result } = renderHook(() => useCities('v'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cities).toEqual([]);
  });

  it('should fetch cities when query is 2 or more characters', async () => {
    const { result } = renderHook(() => useCities('van'));

    await waitFor(() => {
      expect(result.current.cities).toEqual(['Vancouver']);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle server errors gracefully', async () => {
    // Override the handler for this test
    server.use(
      http.get('/cities', () => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useCities('van'));

    await waitFor(() => {
      // Should fallback to client-side filtering
      expect(result.current.cities).toEqual(['Vancouver']);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should update cities when query changes', async () => {
    const { result, rerender } = renderHook(({ query }) => useCities(query), {
      initialProps: { query: 'van' },
    });

    await waitFor(() => {
      expect(result.current.cities).toEqual(['Vancouver']);
    });

    rerender({ query: 'mont' });

    await waitFor(() => {
      expect(result.current.cities).toEqual(['Montreal']);
    });
  });

  it('should clear cities when query becomes too short', async () => {
    const { result, rerender } = renderHook(({ query }) => useCities(query), {
      initialProps: { query: 'van' },
    });

    await waitFor(() => {
      expect(result.current.cities).toEqual(['Vancouver']);
    });

    rerender({ query: 'v' });

    await waitFor(() => {
      expect(result.current.cities).toEqual([]);
    });
  });
});
