import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backend = env.VITE_BACKEND_URL || 'http://localhost:5000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: Number(env.VITE_PORT) || 5173,
      proxy: {
        '/api': {
          target: backend,
          changeOrigin: true,
        },
        '/uploads': {
          target: backend,
          changeOrigin: true,
        },
      },
    },
  }
})
