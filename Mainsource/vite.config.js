import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Disable source maps in production
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements
        drop_debugger: true // Remove debugger statements
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {          
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
