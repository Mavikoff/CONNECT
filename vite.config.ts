import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Относительные пути для работы на любом сервере
  base: './',
  build: {
    // Убеждаемся, что все пути относительные
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Все пути должны быть относительными
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
      }
    }
  }
})
