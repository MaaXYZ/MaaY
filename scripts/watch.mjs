import { spawn } from 'child_process'
import electron from 'electron'
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
function watchMain(server) {
  /**
   * @type {import('child_process').ChildProcessWithoutNullStreams | null}
   */
  let electronProcess = null

  const address = server.httpServer.address()
  const env = Object.assign(process.env, {
    VITE_DEV_SERVER_HOST: address.address,
    VITE_DEV_SERVER_PORT: address.port
  })
  return build({
    configFile: 'app/main/vite.config.ts',
    mode: 'development',
    plugins: [
      {
        name: 'electron-main-watcher',
        writeBundle() {
          // stopQuit()

          if (electronProcess) {
            electronProcess.kill()
          }

          electronProcess = spawn(electron, ['.', '--inspect'], {
            stdio: 'inherit',
            env
          })

          // electronProcess.on('exit', () => {
          //   startQuit()
          // })
        }
      }
    ],
    build: {
      watch: true
    }
  })
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
