// import { init, version } from '@maa/loader'
import { contextBridge, ipcRenderer } from 'electron'

const ipc = {
  on: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ): Electron.IpcRenderer => {
    console.log('preload register: ', channel)
    return ipcRenderer.on(channel, (event, ...args) => {
      console.log('preload on: ', channel, ...args)
      listener(event, ...args)
    })
  },
  off: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ): Electron.IpcRenderer => {
    console.log('preload off: ', channel)
    return ipcRenderer.off(channel, listener)
  },
  invoke: (channel: string, ...args: any[]): Promise<any> => {
    console.log('preload invoke: ', channel, ...args)
    return ipcRenderer.invoke(channel, ...args)
  }
}

contextBridge.exposeInMainWorld('ipcRenderer', ipc)
