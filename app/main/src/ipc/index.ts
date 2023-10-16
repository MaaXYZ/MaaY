import { setupCore } from './core'
import { setupModules } from './module'

export * from './ipc'

export function setupIpc() {
  setupCore()
  setupModules()
}
