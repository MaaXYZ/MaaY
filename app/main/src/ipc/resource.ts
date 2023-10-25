import type { RespackInfo } from '@maa/type'
import { spawn } from 'child_process'
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

import { ipcMainHandle } from '.'
import { registerSend } from '../sync'

const resourcePath = path.join(process.cwd(), 'assets')

async function loadNormalResource(name: string, p: string): Promise<RespackInfo | null> {
  try {
    return {
      name,
      path: p,
      config: {
        repo: { resource: {} },
        control: JSON.parse(await fs.readFile(path.join(p, 'control.json'), 'utf-8')),
        resource: JSON.parse(await fs.readFile(path.join(p, 'resource.json'), 'utf-8'))
      }
    }
  } catch (_) {
    return null
  }
}

async function loadRepoResource(name: string, p: string): Promise<RespackInfo | null> {
  const _maay = path.join(p, '.maay')
  try {
    return {
      name,
      path: p,
      config: {
        repo: JSON.parse(await fs.readFile(path.join(_maay, 'repo.json'), 'utf-8')),
        control: JSON.parse(await fs.readFile(path.join(_maay, 'control.json'), 'utf-8')),
        resource: JSON.parse(await fs.readFile(path.join(_maay, 'resource.json'), 'utf-8'))
      }
    }
  } catch (_) {
    return null
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
    if (existsSync(path.join(p, '.maay'))) {
      const r = await loadRepoResource(name, p)
      if (r) {
        ri[name] = r
      }
    } else {
      const r = await loadNormalResource(name, p)
      if (r) {
        ri[name] = r
      }
    }
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

  ipcMainHandle('main.resource.import', async (_, url) => {
    const name = /\/([^/]+)$/.exec(url)![1]!
    const proc = spawn('git', ['clone', url, path.join(resourcePath, name)], {
      stdio: 'inherit'
    })
    return new Promise<void>(resolve => {
      proc.on('exit', resolve)
    })
  })

  ipcMainHandle('main.resource.join_path', (_, res, p) => {
    const info = resource_info.value[res]!
    if (p.startsWith('@')) {
      return path.join(resourcePath, res, info.config.repo.resource[p.substring(1)]!)
    } else {
      return path.join(resourcePath, res, p)
    }
  })
}
