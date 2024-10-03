import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import injectHTML from 'vite-plugin-html-inject'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    injectHTML(),
    react()
  ],
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


