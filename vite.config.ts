import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import paths from 'vite-tsconfig-paths'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BASE_PATH = process.env.BASE_PATH || '/'

export default defineConfig(() => {
  return {
    base: BASE_PATH,
    build: {
      outDir: 'dist',
      sourcemap: false,
      target: 'es2020',
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          manualChunks: (id) => {
            if (!id.includes('node_modules')) return

            const normalizedId = id.replace(/\\/g, '/')

            if (
              normalizedId.includes('/node_modules/react-router/') ||
              normalizedId.includes('/node_modules/react-router-dom/')
            )
              return 'vendor-routing'

            if (normalizedId.includes('/node_modules/@tanstack/'))
              return 'vendor-tanstack'
            if (normalizedId.includes('/node_modules/axios/'))
              return 'vendor-axios'
            if (normalizedId.includes('/node_modules/zod/')) return 'vendor-zod'

            return 'vendor'
          },
          assetFileNames: ({ name }) => {
            if (/\.(css)$/.test(name ?? ''))
              return 'assets/css/[name]-[hash][extname]'
            if (/\.(png|jpe?g|svg|gif|webp|avif)$/.test(name ?? ''))
              return 'assets/images/[name]-[hash][extname]'
            return 'assets/[name]-[hash][extname]'
          },
        },
      },
    },
    server: {
      open: true,
      port: 4000,
      strictPort: false,
      // Wire a real backend by uncommenting and setting VITE_USE_MOCK=false:
      // proxy: {
      //   '/api': { target: 'http://localhost:8000', changeOrigin: true },
      // },
    },
    plugins: [
      react(),
      paths(),
      svgr({
        include: '**/*.svg?react',
        svgrOptions: {
          svgoConfig: {
            floatPrecision: 2,
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(
        process.env.npm_package_version || '0.0.0'
      ),
    },
  }
})
