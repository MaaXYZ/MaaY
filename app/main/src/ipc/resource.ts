import type { RespackInfo } from '@maa/type'
import fs from 'fs/promises'
import path from 'path'

import { ipcMainHandle } from '.'
import { registerSend } from '../sync'

async function refreshResource() {
  const ri: Record<string, RespackInfo> = {}
  for (const name of await fs.readdir('./assets')) {
    const p = path.join(process.cwd(), 'assets', name)
    if (!(await fs.stat(p)).isDirectory()) {
      continue
    }
    try {
      ri[name] = {
        name,
        path: p,
        config: {
          control: JSON.parse(await fs.readFile(path.join(p, 'control.json'), 'utf-8')),
          resource: JSON.parse(await fs.readFile(path.join(p, 'resource.json'), 'utf-8'))
        }
      }
    } catch (_) {}
  }
  return ri
}

export function setupResource() {
  const resource_info = registerSend('resource_info', {})

  refreshResource().then(v => {
    resource_info.value = v
  })
  ipcMainHandle('main.resource.refresh', async () => {
    resource_info.value = await refreshResource()
  })

  ipcMainHandle('main.resource.join_path', (_, res, p) => {
    return path.join(process.cwd(), 'assets', res, p)
  })
}
