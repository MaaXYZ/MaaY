import { GlobalConfig } from '@maa/type'
import { watch } from '@vue-reactivity/watch'
import { ref } from '@vue/reactivity'
import { existsSync } from 'fs'
import fs from 'fs/promises'

import { ipcMainHandle } from '.'
import { registerRecv, registerRecvFor } from '../sync'

export const ModuleConfigFilePath = 'config.module.json'

export const global_config = ref<GlobalConfig>({})

export async function loadGlobalConfig() {
  if (existsSync(ModuleConfigFilePath)) {
    global_config.value = JSON.parse(
      await fs.readFile(ModuleConfigFilePath, 'utf-8')
    ) as GlobalConfig
  }
}

export async function saveGlobalConfig() {
  await fs.writeFile(ModuleConfigFilePath, JSON.stringify(global_config.value, null, 2))
}

export function setupGlobalConfigAutoSaving() {
  watch(
    global_config,
    () => {
      saveGlobalConfig()
    },
    {
      deep: true,
      immediate: true
    }
  )
}

export function setupGlobalConfig() {
  registerRecvFor('global_config', global_config)
  ipcMainHandle('main.config.fetch_global', () => {
    return JSON.stringify(global_config.value)
  })
}
