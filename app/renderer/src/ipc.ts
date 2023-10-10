import { type ClientSideInterface, type ServerSideInterface } from '@maa/ipc'
import { contextBridge, ipcRenderer } from 'electron'

type WrapPromise<T> = T extends Promise<any> ? T : Promise<T>

export interface IpcRenderer {
  invoke: <Key extends keyof ServerSideInterface>(
    channel: Key,
    ...args: Parameters<ServerSideInterface[Key]>
  ) => WrapPromise<ReturnType<ServerSideInterface[Key]>>

  on: <Key extends keyof ClientSideInterface>(
    channel: Key,
    listener: (
      event: Electron.IpcRendererEvent,
      ...args: Parameters<ClientSideInterface[Key]>
    ) => void
  ) => Electron.IpcRenderer

  off: <Key extends keyof ClientSideInterface>(
    channel: Key,
    listener: (
      event: Electron.IpcRendererEvent,
      ...args: Parameters<ClientSideInterface[Key]>
    ) => void
  ) => Electron.IpcRenderer
}
