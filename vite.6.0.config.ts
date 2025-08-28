import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(thisDir, '6.0/frontend');

export default defineConfig({
  root: appRoot,
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: resolve(appRoot, 'dist')
  }
});
