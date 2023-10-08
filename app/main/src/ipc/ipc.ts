import { type ClientSideInterface, type ServerSideInterface } from '@maa/ipc'
import { type IpcMainInvokeEvent, ipcMain } from 'electron'

import { mainWindow } from '../window'

export function ipcMainHandle<Key extends keyof ServerSideInterface>(
  eventName: Key,
  listener: (
    event: IpcMainInvokeEvent,
    ...args: Parameters<ServerSideInterface[Key]>
  ) => ReturnType<ServerSideInterface[Key]>
): void {
  ipcMain.removeHandler(eventName)
  ipcMain.handle(eventName, (event, ...args) => {
    return listener(event, ...(args as Parameters<ServerSideInterface[Key]>))
  })
}

export function ipcMainRemove(eventName: keyof ServerSideInterface): void {
  ipcMain.removeHandler(eventName)
}

export function ipcMainSend<Key extends keyof ClientSideInterface>(
  eventName: Key,
  ...args: Parameters<ClientSideInterface[Key]>
): void {
  mainWindow.webContents.send(eventName, ...args)
}
