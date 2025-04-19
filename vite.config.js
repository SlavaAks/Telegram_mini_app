import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '1b302d5b95530f3dfdbdd4a0736972ed.serveo.net'
    ]
  }
});
