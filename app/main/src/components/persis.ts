import { watch } from '@vue-reactivity/watch'
import { existsSync } from 'fs'
import fs from 'fs/promises'

import { modules } from '.'

export const ConfigFilePath = 'config.json'

type ModuleConfig = Record<
  string,
  {
    channel?: string
    data?: unknown
  }
>

export async function loadConfig() {
  if (existsSync(ConfigFilePath)) {
    const data = JSON.parse(await fs.readFile(ConfigFilePath, 'utf-8')) as ModuleConfig
    for (const m of modules) {
      if (m.name in data) {
        m.channel = data[m.name]!.channel
        m.channel_config = data[m.name]!.data
      }
    }
  }
}

export async function saveConfig() {
  const obj: ModuleConfig = {}
  for (const m of modules) {
    obj[m.name] = {
      channel: m.channel,
      data: m.channel_config
    }
  }
  await fs.writeFile(ConfigFilePath, JSON.stringify(obj, null, 2))
}

export function setupAutoSaving() {
  watch(
    modules,
    () => {
      saveConfig()
    },
    {
      deep: true,
      immediate: true
    }
  )
}
