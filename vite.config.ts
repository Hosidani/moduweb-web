import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: process.env.VITE_HOST || 'localhost', // Use env var or default to localhost
    https: {
      key: './certs/localhost-key.pem',
      cert: './certs/localhost.pem'
    },
    proxy: {
      '/api': {
        target: 'https://localhost:7288',
        changeOrigin: true,
        secure: false, // for self-signed certificates
      }
    }
  }
})
