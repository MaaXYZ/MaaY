import { BrowserWindow, app, ipcMain } from 'electron'
import * as sms from 'source-map-support'

import { loadModuleConfig, modules, setupModuleConfigAutoSaving } from './components'
import { ipcMainSend, setupIpc } from './ipc'
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

app.on('ready', async () => {
  createWindow()
  await main()
  setupIpc()
})

app.on('window-all-closed', () => {
  app.quit()
})

main()
