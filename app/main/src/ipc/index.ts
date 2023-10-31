import { setupGlobalConfig } from './config'
import { setupLogger } from './logger'
import { setupModules } from './module'
import { setupReload } from './reload'
import { setupResource } from './resource'

export * from './ipc'

export function setupIpc() {
  setupLogger()
  setupModules()
  setupResource()
  setupReload()
  setupGlobalConfig()
}
