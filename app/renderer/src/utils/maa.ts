import { StreamToFlat, setContext } from '@maa/loader'

export function setupMaa() {
  const [ctx, recv] = StreamToFlat((cmd, args) => {
    return window.ipcRenderer.invoke('main.loader.stream', cmd, args)
  })
  setContext(ctx)
  window.ipcRenderer.on('renderer.loader.callback', (_, id, msg, detail) => {
    recv(id, msg, detail)
  })
}
