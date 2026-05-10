import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      chunkSizeWarningLimit: 2500,
      rollupOptions: {
        output: {
          manualChunks: {

            'syntax-highlighter': [
              'react-syntax-highlighter',
            ],
            'katex': ['katex'],
            'markdown': [
              'react-markdown', 
              'remark-parse', 
              'remark-rehype', 
              'remark-gfm', 
              'remark-math', 
              'remark-directive', 
              'remark-frontmatter', 
              'remark-gemoji', 
              'remark-breaks', 
              'rehype-raw', 
              'rehype-sanitize', 
              'rehype-katex'
            ],
            'mermaid': ['mermaid'],
            'vendor': ['react', 'react-dom']
          }
        }
      }
    }
  };
});
