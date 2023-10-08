import { BrowserWindow, app } from 'electron'
import * as sms from 'source-map-support'

import { createWindow } from './window'

sms.install()

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
