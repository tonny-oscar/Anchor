import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['anchor.svg', 'apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'Anchor - Recovery Support',
        short_name: 'Anchor',
        description: 'Cravings are waves. You are the anchor. A calm, private space to track your recovery.',
        lang: 'en',
        theme_color: '#0a1e2d',
        background_color: '#0a1e2d',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/dashboard',
        categories: ['health', 'lifestyle', 'medical'],
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        shortcuts: [
          { name: 'Ride the Wave', short_name: 'Craving help', description: 'Get through a craving right now', url: '/craving', icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }] },
          { name: 'Daily check-in', short_name: 'Check in', description: 'Log how you are feeling today', url: '/dashboard', icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }] },
          { name: 'Find help near me', short_name: 'Find help', description: 'Treatment, hospitals and pharmacies on the map', url: '/find-help', icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }] },
          { name: 'Community', short_name: 'Community', description: 'Join the Anchor WhatsApp community', url: '/community', icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }] }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,webmanifest}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/__/],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-tiles',
              expiration: { maxEntries: 600, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-storage-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
})
