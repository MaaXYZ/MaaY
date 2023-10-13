import { setupCore } from './core'
import { setupLoader } from './loader'

export * from './ipc'

export function setupIpc() {
  setupCore()
  setupLoader()
}
