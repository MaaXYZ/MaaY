import { ipcMainHandle, ipcMainSend } from './ipc'

export function setupCore() {
  ipcMainHandle('main.core.log', (_, str) => {
    console.log(str)

    setTimeout(() => {
      ipcMainSend('renderer.core.log', str)
    }, 2000)
  })
}
