import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Kept separate from `vite.config.ts` so the app build never carries test-only
 * config. Aliases mirror the app's `@/*` path so tests import exactly what the
 * app does.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    restoreMocks: true,
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/**/index.ts',
        'src/**/*.types.ts',
        'src/vite-env.d.ts',
        'src/main.tsx',
      ],
    },
  },
  define: {
    'import.meta.env.VITE_USE_MOCK': JSON.stringify('true'),
    'import.meta.env.VITE_BASE_URL': JSON.stringify('http://test.local/'),
    // No artificial latency in tests — assertions wait on events, not clocks.
    'import.meta.env.VITE_MOCK_DELAY': JSON.stringify('0'),
  },
})
