import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon.svg'], // Keep svg as fallback or asset
      manifest: {
        name: 'Lie Detector - Truth Pulse',
        short_name: 'Lie Detector',
        description: 'Detect lies using your heart rate!',
        theme_color: '#1e293b', // Dark theme for neon look
        background_color: '#1e293b',
        display: 'standalone',
        orientation: 'portrait',
        id: '/', // Audit fix
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [ // Audit fix (Placeholder for now, but crucial for install prompt)
          {
            src: 'pwa-512x512.png', // Re-using icon as placeholder if we don't have screenshots yet, or remove if strict
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Welcome Screen'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Mobile Screen'
          }
        ]
      }
    })
  ],
})
