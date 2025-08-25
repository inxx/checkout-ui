import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  preview: {
    port: 4174, // 다른 포트로 변경
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})