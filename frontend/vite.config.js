import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  define: {
    __API_BASE__: JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? 'https://insight-hub-api-mbmm.onrender.com'
        : ''
    ),
  },
})
