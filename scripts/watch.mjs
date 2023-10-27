import { spawn } from 'child_process'
import electron from 'electron'
import esbuild from 'esbuild'
import { build, createServer } from 'vite'

// let quitTimer = null

// function startQuit() {
//   quitTimer = setTimeout(() => {
//     process.exit(0)
//   }, 1000)
// }

// function stopQuit() {
//   if (quitTimer) {
//     clearTimeout(quitTimer)
//     quitTimer = null
//   }
// }

/**
 * @type {(server: import('vite').ViteDevServer) => Promise<import('rollup').RollupWatcher>}
 */
async function watchMain(server) {
  /**
   * @type {import('child_process').ChildProcessWithoutNullStreams | null}
   */
  let electronProcess = null

  const address = server.httpServer.address()
  const env = Object.assign(process.env, {
    VITE_DEV_SERVER_HOST: address.address,
    VITE_DEV_SERVER_PORT: address.port
  })
  const ctx = await esbuild.context({
    entryPoints: ['app/main/src/main.ts'],
    platform: 'node',
    bundle: true,
    external: ['electron'],
    outdir: './dist/main',
    sourcemap: true,
    plugins: [
      {
        name: 'electron-main-watcher',
        setup(ctx) {
          ctx.onEnd(() => {
            console.log('main rebuilt')
            if (electronProcess) {
              electronProcess.kill('SIGINT')
            }

            electronProcess = spawn(electron, ['.', '--inspect', '--remote-debugging-port=9223'], {
              stdio: 'inherit',
              env
            })
          })
        }
      }
    ]
  })
  process.on('SIGINT', () => {
    if (electronProcess) {
      electronProcess.kill('SIGINT')
      electronProcess.on('exit', () => {
        process.exit(0)
      })
    } else {
      process.exit(0)
    }
  })
  await ctx.watch()
}

/**
 * @type {(server: import('vite').ViteDevServer) => Promise<import('rollup').RollupWatcher>}
 */
function watchPreload(server) {
  return build({
    configFile: 'app/preload/vite.config.ts',
    mode: 'development',
    plugins: [
      {
        name: 'electron-preload-watcher',
        writeBundle() {
          server.ws.send({ type: 'full-reload' })
        }
      }
    ],
    build: {
      watch: true
    }
  })
}

// bootstrap
const server = await createServer({
  configFile: 'app/renderer/vite.config.ts'
})

await server.listen()
await watchPreload(server)
await watchMain(server)
