import { BrowserWindow, app } from 'electron'
import * as path from 'path'
import * as sms from 'source-map-support'

import useDebug from './misc/debug'

sms.install()

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
    // webPreferences: {
    //   preload: path.join(__dirname, 'preload.js')
    // }
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
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
