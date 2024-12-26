import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000', // Backend server
        ws: true, // Enable WebSocket proxying
        changeOrigin: true, // Adjust origin headers
        secure: false, // Disable SSL verification (for local development)
      },
    },
  },
});