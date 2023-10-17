import { setupCore } from './core'
import { setupModules } from './module'
import { setupResource } from './resource'

export * from './ipc'

export function setupIpc() {
  setupCore()
  setupModules()
  setupResource()
}
