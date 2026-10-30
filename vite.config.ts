import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // The prerender script loads the app through Vite; the router must go through it as ESM.
  // Without the `node` condition it resolves to the router's ESM build instead of its CommonJS one.
  ssr: {
    noExternal: ['react-router', 'react-router-dom'],
    resolve: { conditions: ['import', 'module', 'production'] },
  },
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      // A new version waits for the person: it must never reload the page while they are typing.
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        id: '/',
        name: '¿Qué te debo?',
        short_name: '¿Qué te debo?',
        description:
          'Dividí los gastos de la juntada: cada uno carga lo que puso y la app dice quién le pasa cuánto a quién.',
        lang: 'es-AR',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f6f1e7',
        theme_color: '#f6f1e7',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell, the icons and the Latin subsets of the font; not the share image.
        globPatterns: ['**/*.{js,css,html,ico,svg}', 'icons/*.png', 'assets/*latin*opsz*.woff2'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
