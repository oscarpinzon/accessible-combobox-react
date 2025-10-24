import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';
import allCities from './public/cities.json';

export default defineConfig({
  base: '/accessible-combobox-react',
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.a11y.test.{ts,tsx}',
        'src/__tests__/',
        'vitest.setup.ts',
        'vite.config.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/*.module.css',
        '**/index.ts',
        '**/*.d.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
