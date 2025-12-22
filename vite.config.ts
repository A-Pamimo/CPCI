import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    base: './', // Critical: ensures assets are loaded relatively (e.g. for user.github.io/repo/)
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    },
    define: {
      // Polyfill process.env for the application code which relies on it
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});