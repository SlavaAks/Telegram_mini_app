import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'ef3c668006fbfeb7f1cb35a1c8e7922e.serveo.net'
    ]
  }
});
