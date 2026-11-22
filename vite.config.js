import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('lenis')) return 'vendor-lenis';
            if (id.includes('gsap')) return 'vendor-animation';
            if (id.includes('framer-motion')) return 'vendor-framer';
            if (id.includes('lucide-react') || id.includes('react-icons')) return 'vendor-icons';
            if (
              id.includes('marked') ||
              id.includes('turndown') ||
              id.includes('react-markdown') ||
              id.includes('remark-gfm') ||
              id.includes('react-signature-canvas')
            ) {
              return 'vendor-editor';
            }
            if (id.includes('react-router')) return 'vendor-router';
            return 'vendor-core';
          }
        }
      }
    }
  }
})
