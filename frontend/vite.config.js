import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['**/*'],
            manifest: {
                name: 'Movie List',
                short_name: 'Movie List',
                description: 'All the movie lists in one place!',
                start_url: '/',
                scope: '.',
                display: 'standalone',
                theme_color: '#000000',
                background_color: '#ffffff',
                orientation: 'portrait',
                lang: 'en-US',
                icons: [
                    {
                        src: 'The_Criterion_Collection_Logo.svg',
                        sizes: 'any',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
})
