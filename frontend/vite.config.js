import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://15.206.203.0:8000', // Your backend server
        changeOrigin: true, // Modify the origin of the request
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Keep the /api prefix in the request
      },
    },
  },
});
