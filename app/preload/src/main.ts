// import { init, version } from '@maa/loader'
import { inspectBuffer, inspectBuffers } from '@maa/loader/src/helper/buffer'
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
  invoke: async (channel: string, ...args: any[]): Promise<any> => {
    console.log('preload invoke: ', channel, ...inspectBuffers(...args))
    const ret = await ipcRenderer.invoke(channel, ...args)
    console.log('preload invoke: ', channel, 'return: ', inspectBuffer(ret))
    return ret
  }
}

contextBridge.exposeInMainWorld('ipcRenderer', ipc)
