import type { RespackInfo } from '@maa/type'
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

import { ipcMainHandle } from '.'
import { registerSend } from '../sync'

const resourcePath = path.join(process.cwd(), 'assets')

async function readJsonOr(path: string, data: any): Promise<any> {
  if (existsSync(path)) {
    return JSON.parse(await fs.readFile(path, 'utf-8'))
  } else {
    return data
  }
}

async function refreshResource() {
  await fs.mkdir(resourcePath, { recursive: true })
  const ri: Record<string, RespackInfo> = {}
  for (const name of await fs.readdir(resourcePath)) {
    const p = path.join(resourcePath, name)
    if (!(await fs.stat(p)).isDirectory()) {
      continue
    }
    try {
      ri[name] = {
        name,
        path: p,
        config: {
          repo: await readJsonOr(path.join(p, 'repo.json'), {
            resource: {}
          }),
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
    const info = resource_info.value[res]!
    if (p.startsWith('@')) {
      return path.join(resourcePath, res, 'repo', info.config.repo.resource[p.substring(1)]!)
    } else {
      return path.join(resourcePath, res, p)
    }
  })
}
