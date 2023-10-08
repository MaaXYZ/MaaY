import { BrowserWindow, app } from 'electron'
import * as path from 'path'

import { setupIpc } from '../ipc'
import useDebug from '../misc/debug'

export let mainWindow: BrowserWindow

export function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/main.js')
    }
  })

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  } else {
    mainWindow.loadURL(
      `http://${process.env.VITE_DEV_SERVER_HOST}:${process.env.VITE_DEV_SERVER_PORT}`
    )
    mainWindow.webContents.on('did-frame-finish-load', () => {
      useDebug(mainWindow)
    })
  }

  setupIpc()
}
