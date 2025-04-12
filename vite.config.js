import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'b11d84993cdb12724a96c74f1dee1b4e.serveo.net'
    ]
  }
});
