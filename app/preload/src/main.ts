// import { init, version } from '@maa/loader'
import { contextBridge, ipcRenderer } from 'electron'

const ipc = {
  on: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ): Electron.IpcRenderer => {
    return ipcRenderer.on(channel, (event, ...args) => {
      console.log(channel, ...args)
      listener(event, args)
    })
  },
  off: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ): Electron.IpcRenderer => {
    return ipcRenderer.off(channel, listener)
  },
  invoke: (channel: string, ...args: any[]): Promise<any> => {
    console.log(channel, ...args)
    return ipcRenderer.invoke(channel, ...args)
  }
}

contextBridge.exposeInMainWorld('ipcRenderer', ipc)
