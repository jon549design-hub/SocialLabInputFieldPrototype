import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// On GitHub Pages the app is served from /<repo>/, so the production build
// needs that base path. Local dev/preview stays at the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/SocialLabInputFieldPrototype/' : '/',
  plugins: [react(), tailwindcss()],
  server: { port: Number(process.env.PORT) || 5174 },
}))
