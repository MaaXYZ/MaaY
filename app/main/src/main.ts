import { BrowserWindow, app, ipcMain } from 'electron'
import path from 'path'
import * as sms from 'source-map-support'

import pkg from '../../../package.json'
import { loadModuleConfig, modules, setupModuleConfigAutoSaving } from './components'
import { ipcMainSend, setupIpc } from './ipc'
import { loadGlobalConfig, setupGlobalConfigAutoSaving } from './ipc/config'
import { useLogger } from './misc/logger'
import { createWindow } from './window'

sms.install()

async function main() {
  await useLogger()
  await loadGlobalConfig()
  await loadModuleConfig()
  for (const m of modules) {
    const state = await m.load()
    console.log(m.name, state)
  }
  setupGlobalConfigAutoSaving()
  setupModuleConfigAutoSaving()
}

app.setAboutPanelOptions({
  applicationName: 'MaaY',
  applicationVersion: pkg.version,
  iconPath: path.join(__dirname, '../renderer/assets/icon.png')
})

app.on('ready', async () => {
  createWindow()
  await main()
  setupIpc()
})

app.on('window-all-closed', () => {
  app.quit()
})
