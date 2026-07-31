import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  test: {
    environment: 'happy-dom',
    globals: true
  }
});
