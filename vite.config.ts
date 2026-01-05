import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  base: mode === 'production' ? '/guitar/' : '/',
}))
