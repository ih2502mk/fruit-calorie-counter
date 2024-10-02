import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {    
      '/fruit-api': {
        target: 'https://www.fruityvice.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fruit-api/, '/api'),
      },
    },
  },
})


