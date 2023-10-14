import { init, version } from '@maa/loader'
import { BrowserWindow, app } from 'electron'
import * as sms from 'source-map-support'

import { loadConfig, modules, setupAutoSaving } from './components'
import { createWindow } from './window'

sms.install()

async function main() {
  await loadConfig()
  for (const m of modules) {
    const state = await m.load()
    console.log(m.name, state)
  }
  setupAutoSaving()
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

main()
