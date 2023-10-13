import { init, version } from '@maa/loader'
import { BrowserWindow, app } from 'electron'
import * as sms from 'source-map-support'

import { connectRpc } from './stores'
import { createWindow } from './window'

sms.install()

connectRpc()

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
