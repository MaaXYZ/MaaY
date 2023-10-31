import { rendererLogger } from '../misc/logger'
import { ipcMainHandle } from './ipc'

export function setupLogger() {
  ipcMainHandle('$main.core.log', (_, cate, ...data) => {
    rendererLogger.logger[cate](...data)
  })
}
