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
    'import.meta.env.PUBLIC_API_MOUNT_PATH': JSON.stringify(process.env.PUBLIC_API_MOUNT_PATH || '')
  }
});
