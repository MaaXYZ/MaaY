import { BrowserWindow, app } from 'electron'
import * as sms from 'source-map-support'

import { loadModuleConfig, modules, setupModuleConfigAutoSaving } from './components'
import { loadGlobalConfig, setupGlobalConfigAutoSaving } from './ipc/config'
import { createWindow } from './window'

sms.install()

async function main() {
  await loadGlobalConfig()
  await loadModuleConfig()
  for (const m of modules) {
    const state = await m.load()
    console.log(m.name, state)
  }
  setupGlobalConfigAutoSaving()
  setupModuleConfigAutoSaving()
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
