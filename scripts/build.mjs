import { build } from 'vite'

await build({ configFile: 'app/main/vite.config.ts' })
await build({ configFile: 'app/preload/vite.config.ts' })
await build({ configFile: 'app/renderer/vite.config.ts' })
