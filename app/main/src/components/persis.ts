import { watch } from '@vue-reactivity/watch'
import { existsSync } from 'fs'
import fs from 'fs/promises'

import { modules } from '.'
import { useThrottle } from '../misc/throttle'

export const ModuleConfigFilePath = 'config.module.json'

type ModuleConfig = Record<
  string,
  {
    channel?: string
    data?: unknown
  }
>

export async function loadModuleConfig() {
  if (existsSync(ModuleConfigFilePath)) {
    const data = JSON.parse(await fs.readFile(ModuleConfigFilePath, 'utf-8')) as ModuleConfig
    for (const m of modules) {
      if (m.name in data) {
        m.channel = data[m.name]!.channel
        m.config = data[m.name]!.data
      }
    }
  }
}

export async function saveModuleConfig() {
  const obj: ModuleConfig = {}
  for (const m of modules) {
    obj[m.name] = {
      channel: m.channel,
      data: m.config
    }
  }
  await fs.writeFile(ModuleConfigFilePath, JSON.stringify(obj, null, 2))
}

export function setupModuleConfigAutoSaving() {
  watch(modules, useThrottle(saveModuleConfig), {
    deep: true,
    immediate: true
  })
}
