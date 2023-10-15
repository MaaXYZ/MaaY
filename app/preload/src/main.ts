// import { init, version } from '@maa/loader'
import { contextBridge, ipcRenderer } from 'electron'

const ipc = {
  on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    console.log('preload register: ', channel)
    ipcRenderer.on(channel, (event, ...args) => {
      console.log('preload on: ', channel, ...args)
      listener(event, ...args)
    })
    return listener
  },
  off: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    console.log('preload off: ', channel)
    ipcRenderer.off(channel, listener)
  },
  invoke: (channel: string, ...args: any[]): Promise<any> => {
    console.log('preload invoke: ', channel, ...args)
    return ipcRenderer.invoke(channel, ...args)
  }
}

contextBridge.exposeInMainWorld('ipcRenderer', ipc)
