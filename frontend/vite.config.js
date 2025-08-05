// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import axios from 'axios';
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL ||`https://suvidha-backend-app.azurewebsites.net`,
        changeOrigin: true,
        secure: false,
        credentials: true,
      },
    },
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL),
  },
  
});