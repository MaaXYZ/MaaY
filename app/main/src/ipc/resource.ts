import type { RespackInfo } from '@maa/type'
import { spawn } from 'child_process'
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

import { ipcMainHandle } from '.'
import { registerSend } from '../sync'

const resourcePath = path.join(process.cwd(), 'assets')

type ResourceResolveInfo = { path: string; type: 'direct' | 'redirect' }

async function resolveResource(name: string): Promise<ResourceResolveInfo> {
  let res = path.join(resourcePath, name)
  if ((await fs.stat(res)).isDirectory()) {
    return {
      path: res,
      type: 'direct'
    }
  } else {
    return {
      path: await fs.readFile(res, 'utf-8'),
      type: 'redirect'
    }
  }
}

async function loadNormalResource(
  name: string,
  p: ResourceResolveInfo
): Promise<RespackInfo | null> {
  try {
    return {
      name,
      path: p.path,
      type: 'direct',
      link: p.type,
      config: {
        repo: { resource: {} },
        control: JSON.parse(await fs.readFile(path.join(p.path, 'control.json'), 'utf-8')),
        resource: JSON.parse(await fs.readFile(path.join(p.path, 'resource.json'), 'utf-8'))
      }
    }
  } catch (_) {
    return null
  }
}

async function loadRepoResource(name: string, p: ResourceResolveInfo): Promise<RespackInfo | null> {
  const _maay = path.join(p.path, '.maay')
  try {
    return {
      name,
      path: p.path,
      type: 'repo',
      link: p.type,
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
    const rp = await resolveResource(name)
    if (!(await fs.stat(rp.path)).isDirectory()) {
      continue
    }
    if (existsSync(path.join(rp.path, '.maay'))) {
      const r = await loadRepoResource(name, rp)
      if (r) {
        ri[name] = r
      }
    } else {
      const r = await loadNormalResource(name, rp)
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

  ipcMainHandle('main.resource.delete', async (_, name) => {
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      // for save
      return false
    }
    if (!existsSync(path.join(resourcePath, name))) {
      return false
    }
    await fs.rm(path.join(resourcePath, name), { recursive: true })
    return true
  })

  ipcMainHandle('main.resource.import_repo', async (_, name, url) => {
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      // for save
      return false
    }
    if (existsSync(path.join(resourcePath, name))) {
      return false
    }
    const repoPath = path.join(resourcePath, name)
    const proc = spawn('git', ['clone', url, repoPath], {
      stdio: 'inherit'
    })
    return new Promise<boolean>(resolve => {
      proc.on('exit', async () => {
        if (proc.exitCode === 0 && existsSync(path.join(repoPath, '.maay'))) {
          resolve(true)
        } else {
          if (existsSync(repoPath)) {
            await fs.rm(repoPath, { recursive: true })
          }
          resolve(false)
        }
      })
    })
  })

  ipcMainHandle('main.resource.import_dir', async (_, name, dir) => {
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      // for save
      return false
    }
    if (existsSync(path.join(resourcePath, name))) {
      return false
    }
    if (!existsSync(dir)) {
      return false
    }
    await fs.writeFile(path.join(resourcePath, name), dir)
    return true
  })

  ipcMainHandle('main.resource.join_path', async (_, name, p) => {
    const info = resource_info.value[name]!
    const rp = await resolveResource(name)
    if (p.startsWith('@')) {
      return path.join(rp.path, info.config.repo.resource[p.substring(1)]!)
    } else {
      return path.join(rp.path, p)
    }
  })
}
