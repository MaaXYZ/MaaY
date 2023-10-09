import { init, version } from '@maa/loader'
import { BrowserWindow, app } from 'electron'
import * as sms from 'source-map-support'

import { createWindow } from './window'

sms.install()

init('0.0.0.0:8080').then(ok => {
  if (ok) {
    version().then(v => {
      console.log(v)
    })
  } else {
    console.log('RPC Not Running')
  }
})

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
