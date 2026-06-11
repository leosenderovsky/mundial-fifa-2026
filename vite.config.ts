import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-leaflet': ['leaflet', 'react-leaflet'],
          'vendor-motion': ['framer-motion'],
          'vendor-gemini': ['@google/generative-ai'],
          'vendor-query': ['@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://adservice.google.com https://www.googletagservices.com https://tpc.googlesyndication.com https://*.adtrafficquality.google; frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com; img-src 'self' data: https://*.googlesyndication.com https://*.google.com https://*.gstatic.com https://*.doubleclick.net https://media.api-sports.io https://crests.football-data.org https://upload.wikimedia.org https://www.thesportsdb.com https://thesportsdb.com https://images.thesportsdb.com https://*.basemaps.cartocdn.com; connect-src 'self' https://api.football-data.org https://*.googlesyndication.com https://adservice.google.com https://*.doubleclick.net https://*.adtrafficquality.google https://*.basemaps.cartocdn.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
    },
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:9999',
        changeOrigin: true,
      },
    },
  },
});
