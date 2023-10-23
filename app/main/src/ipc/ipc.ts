import { type ClientSideInterface, type ServerSideInterface } from '@maa/ipc'
import { type IpcMainInvokeEvent, ipcMain } from 'electron'

import { mainWindow } from '../window'

type WithPromise<T> = Awaited<T> | Promise<Awaited<T>>

export function ipcMainHandle<Key extends keyof ServerSideInterface>(
  eventName: Key,
  listener: (
    event: IpcMainInvokeEvent,
    ...args: Parameters<ServerSideInterface[Key]>
  ) => WithPromise<ReturnType<ServerSideInterface[Key]>>
): void {
  console.log('main register: ', eventName)
  ipcMain.removeHandler(eventName)
  ipcMain.handle(eventName, async (event, ...args) => {
    console.log('main handle: ', eventName, ...args)
    const result = await listener(event, ...(args as Parameters<ServerSideInterface[Key]>))
    console.log('main handle: ', eventName, 'return: ', result)
    return result
  })
}

export function ipcMainRemove(eventName: keyof ServerSideInterface): void {
  console.log('main remove: ', eventName)
  ipcMain.removeHandler(eventName)
}

export function ipcMainSend<Key extends keyof ClientSideInterface>(
  eventName: Key,
  ...args: Parameters<ClientSideInterface[Key]>
): void {
  console.log('main send: ', eventName, ...args)
  mainWindow.webContents.send(eventName, ...args)
}
