import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '29b53f5287c373014783c83e5b31c2bd.serveo.net'
    ]
  }
});
