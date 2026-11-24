import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Tự động cập nhật app khi có phiên bản mới
      includeAssets: ['Logo.png'], 
      manifest: {
        name: 'QFix-QSVN',
        short_name: 'QFix',
        description: 'Hệ thống Báo cáo Sự cố QFix',
        theme_color: '#0a5c36',
        background_color: '#ffffff',
        display: 'standalone', // Ẩn thanh địa chỉ trình duyệt, trông như app thật
        icons: [
          {
            src: 'Logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'Logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'Logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Hỗ trợ Android tự động bo góc icon cho đẹp
          }
        ]
      }
    })
  ]
})