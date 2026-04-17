import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// User's custom Vite configuration
export default defineConfig({
  base: process.env.COSMIC_MOUNT_PATH || process.env.VITE_BASE_PATH || '',
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: 'esbuild',
  },
  server: {
    port: 3000,
  },
  define: {
    'import.meta.env.APP_PUBLIC_API_PATH': JSON.stringify(process.env.APP_PUBLIC_API_PATH || '')
  }
});
