import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    'import.meta.env.VITE_MOCK_MODE': JSON.stringify(process.env.VITE_MOCK_MODE || 'false'),
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    headers: {
      'Cache-Control': 'no-store',
    },
    hmr: {
      overlay: true,
    },
    proxy: {
      '/api': {
        target: 'http://172.29.167.191:4080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
