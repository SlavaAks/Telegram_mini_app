import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'becf31969ee36eb56903afa429877bf7.serveo.net'
    ]
  }
});
