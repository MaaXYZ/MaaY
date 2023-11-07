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
 * @type {(server: import('vite').ViteDevServer, preloadOk: Promise<void> | null) => Promise<import('rollup').RollupWatcher>}
 */
async function watchMain(server, preloadOk) {
  /**
   * @type {import('child_process').ChildProcessWithoutNullStreams | null}
   */
  let electronProcess = null

  const address = server.httpServer.address()
  const env = Object.assign(process.env, {
    VITE_DEV_SERVER_HOST: address.address,
    VITE_DEV_SERVER_PORT: address.port
  })
  if (process.argv.includes('--vscode')) {
    Object.assign(env, {
      DEBUG_IN_VSCODE: '1'
    })
  }
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
          ctx.onEnd(async () => {
            console.log('main rebuilt')
            if (electronProcess) {
              electronProcess.kill('SIGINT')
            }
            if (preloadOk) {
              console.log('Wait preload finish')
              await preloadOk
              preloadOk = null
            }
            electronProcess = spawn(electron, ['.', '--inspect', '--remote-debugging-port=9876'], {
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
  let resolve
  const preloadOk = new Promise(async res => {
    resolve = res
  })
  build({
    configFile: 'app/preload/vite.config.ts',
    mode: 'development',
    plugins: [
      {
        name: 'electron-preload-watcher',
        writeBundle() {
          if (resolve) {
            resolve()
            resolve = undefined
          }
          server.ws.send({ type: 'full-reload' })
        }
      }
    ],
    build: {
      watch: true
    }
  })
  return preloadOk
}

// bootstrap
const server = await createServer({
  configFile: 'app/renderer/vite.config.ts'
})

await server.listen()
const preloadOk = watchPreload(server)
await watchMain(server, preloadOk)
