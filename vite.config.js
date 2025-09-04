import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/workflow-designer/',
  server: {
    port: 8000,
    host: 'localhost'
  }
});
