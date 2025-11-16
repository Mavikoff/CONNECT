import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // базовый путь для GitHub Pages (https://mavikoff.github.io/CONNECT/)
  // при деплое на другой домен можно поменять на '/'
  base: '/CONNECT/',
})
