import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// User's custom Vite configuration
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: 'terser',
  },
  server: {
    port: 3000,
  },
});
