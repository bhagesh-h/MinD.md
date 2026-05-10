import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, '.', '');

  return {
    base: command === 'serve' ? '/' : '/MinD.md/',
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            // React core - loaded first, cached aggressively
            'vendor': ['react', 'react-dom'],
            // Lucide is ~200KB unpacked — split into its own chunk
            'icons': ['lucide-react'],
            // The 42KB mockup file loads lazily via Suspense anyway,
            // but splitting it ensures the main bundle stays tiny
            'mockups': ['./src/components/MockupViews'],
          }
        }
      }
    }
  };
});