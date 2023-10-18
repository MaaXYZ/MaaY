import { builtinModules } from 'module'
import { defineConfig } from 'vite'

import pkg from './package.json'

// https://vitejs.dev/config
export default defineConfig({
  root: __dirname,
  build: {
    ssr: true, // make it pick main instead of browser
    lib: {
      entry: 'src/main.ts',
      name: 'main',
      formats: ['cjs'],
      fileName: () => '[name].js'
    },
    outDir: '../../dist/main',
    emptyOutDir: true,
    rollupOptions: {
      external: ['electron', ...builtinModules, ...Object.keys(pkg.dependencies ?? {})]
    },
    sourcemap: true
  }
})
