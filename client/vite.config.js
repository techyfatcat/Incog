import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Existing API proxy
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },

      // ✅ SSR group routes — forward to Express so EJS is rendered
      "/groups": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
})
