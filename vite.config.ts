import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Kniha-jazd-new/', // Názov repozitára na GitHub
  build: {
    outDir: 'dist',
  }
});