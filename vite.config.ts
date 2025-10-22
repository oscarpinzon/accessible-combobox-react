import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import allCities from './public/cities.json';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'mock-cities-endpoint',
      configureServer(server) {
        server.middlewares.use('/cities', (req, res) => {
          const url = new URL(req.url!, 'http://localhost');
          const q = (url.searchParams.get('q') || '').toLocaleLowerCase();
          const results = (allCities as string[])
            .filter((c) => c.toLocaleLowerCase().includes(q))
            .slice(0, 20);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(results));
        });
      },
    },
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
});
