import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config
export default defineConfig({
  root: __dirname,
  server: {
    host: '127.0.0.1',
    port: 5173
  },
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  plugins: [vue(), vueJsx()]
})
