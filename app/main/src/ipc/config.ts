import { GlobalConfig } from '@maa/type'
import { watch } from '@vue-reactivity/watch'
import { ref } from '@vue/reactivity'
import { existsSync } from 'fs'
import fs from 'fs/promises'

import { ipcMainHandle } from '.'
import { useThrottle } from '../misc/throttle'
import { registerRecvFor } from '../sync'

export const GlobalConfigFilePath = 'config.json'

export const global_config = ref<GlobalConfig>({})

export async function loadGlobalConfig() {
  if (existsSync(GlobalConfigFilePath)) {
    global_config.value = JSON.parse(
      await fs.readFile(GlobalConfigFilePath, 'utf-8')
    ) as GlobalConfig
  }
}

export async function saveGlobalConfig() {
  await fs.writeFile(GlobalConfigFilePath, JSON.stringify(global_config.value, null, 2))
}

export function setupGlobalConfigAutoSaving() {
  watch(global_config, useThrottle(saveGlobalConfig), {
    deep: true,
    immediate: true
  })
}

export function setupGlobalConfig() {
  registerRecvFor('global_config', global_config)
  ipcMainHandle('main.config.fetch_global', () => {
    return JSON.parse(JSON.stringify(global_config.value))
  })
}
