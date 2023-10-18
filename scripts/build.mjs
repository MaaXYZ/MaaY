import esbuild from 'esbuild'
import { build } from 'vite'

await esbuild.build({
  entryPoints: ['app/main/src/main.ts'],
  platform: 'node',
  bundle: true,
  external: ['electron', 'electron'],
  outdir: './dist/main',
  minify: true,
  sourcemap: true
})
await build({ configFile: 'app/preload/vite.config.ts' })
await build({ configFile: 'app/renderer/vite.config.ts' })
