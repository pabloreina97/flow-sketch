import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  server: {
    mimeTypes: {
      'application/wasm': ['wasm'],
    },
  },
  build: {
    assetsInlineLimit: 0,
  },
});
