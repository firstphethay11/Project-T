import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // อนุญาตให้เชื่อมต่อจากภายนอก Docker container
    port: 5173,
    watch: {
      usePolling: true, // สำคัญมากสำหรับ Docker บน Windows เพื่อให้ Hot Reload ตรวจพบการแก้ไขไฟล์ทันที
      interval: 300,
    },
  },
})
