import { contextBridge, ipcRenderer } from 'electron'

// --------- Expose some API to the Renderer process. ---------
const ipc = {
  on: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ): Electron.IpcRenderer => {
    return ipcRenderer.on(channel, listener)
  },
  off: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ): Electron.IpcRenderer => {
    return ipcRenderer.off(channel, listener)
  },
  invoke: (channel: string, ...args: any[]): Promise<any> => {
    return ipcRenderer.invoke(channel, ...args)
  }
}

contextBridge.exposeInMainWorld('ipcRenderer', ipc)
