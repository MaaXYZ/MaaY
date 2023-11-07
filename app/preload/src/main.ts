import { inspectBuffer, inspectBuffers } from '@maa/loader/src/helper/buffer'
import { contextBridge, ipcRenderer } from 'electron'

const ipc = {
  on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    if (!channel.startsWith('$')) {
      console.log('preload register', channel)

      ipcRenderer.on(channel, (event, ...args) => {
        console.log('preload on', channel, ...inspectBuffers(...args))

        listener(event, ...args)
      })
    } else {
      ipcRenderer.on(channel, (event, ...args) => {
        listener(event, ...args)
      })
    }
    return listener
  },
  off: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    if (!channel.startsWith('$')) {
      console.log('preload off', channel)
    }
    ipcRenderer.off(channel, listener)
  },
  invoke: async (channel: string, ...args: any[]): Promise<any> => {
    if (!channel.startsWith('$')) {
      console.log('preload invoke', channel, ...inspectBuffers(...args))

      const ret = await ipcRenderer.invoke(channel, ...args)
      console.log('preload invoke', channel, 'return', inspectBuffer(ret))

      return ret
    } else {
      return await ipcRenderer.invoke(channel, ...args)
    }
  }
}

contextBridge.exposeInMainWorld('ipcRenderer', ipc)
