import { ipcMainHandle } from './ipc'

export function setupCore() {
  ipcMainHandle('main.core.log', (_, str) => {
    console.log(str)
  })
}
