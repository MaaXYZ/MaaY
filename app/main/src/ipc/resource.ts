import type { ResourceInfo } from '@maa/ipc'
import fs from 'fs/promises'
import path from 'path'

import { ipcMainHandle } from '.'
import { registerSend } from '../sync'

export function setupResource() {
  const resource_info = registerSend('resource_info', {})

  ipcMainHandle('main.resource.refresh', async () => {
    const ri: Record<string, ResourceInfo> = {}
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
    resource_info.value = ri
  })

  ipcMainHandle('main.resource.join_path', (_, res, p) => {
    return path.join(process.cwd(), 'assets', res, p)
  })
}
