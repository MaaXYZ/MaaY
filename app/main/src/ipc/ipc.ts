import type { ClientSideInterface, ServerSideInterface } from '@maa/ipc'
import { inspectBuffer, inspectBuffers } from '@maa/loader'
import { logger } from '@maa/logger'
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
  if (!eventName.startsWith('$')) {
    logger.silly('register', eventName)
  }
  ipcMain.removeHandler(eventName)
  if (eventName.startsWith('$')) {
    ipcMain.handle(eventName, (event, ...args) => {
      return listener(event, ...(args as Parameters<ServerSideInterface[Key]>))
    })
  } else {
    ipcMain.handle(eventName, async (event, ...args) => {
      logger.silly('handle', eventName, ...inspectBuffers(...args))
      const result = await listener(event, ...(args as Parameters<ServerSideInterface[Key]>))
      logger.silly('handle', eventName, 'return', inspectBuffer(result))
      return result
    })
  }
}

export function ipcMainRemove(eventName: keyof ServerSideInterface): void {
  if (!eventName.startsWith('$')) {
    logger.silly('remove', eventName)
  }
  ipcMain.removeHandler(eventName)
}

export function ipcMainSend<Key extends keyof ClientSideInterface>(
  eventName: Key,
  ...args: Parameters<ClientSideInterface[Key]>
): void {
  if (!eventName.startsWith('$')) {
    logger.silly('send', eventName, ...args)
  }
  mainWindow?.webContents.send(eventName, ...args)
}
