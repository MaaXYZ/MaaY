import {
  Backend,
  BackendContext,
  Frontend,
  definitions,
  destroyContext,
  setFrontend,
  set_log_dir,
  set_save_draw,
  setupContext,
  streamAdapterBackendWithDirect,
  waitClientReady
} from '@maa/loader'
import { logger } from '@maa/logger'
import { shallowRef } from '@vue/reactivity'
import { ChildProcess, spawn } from 'child_process'
import path from 'path'

import { ipcMainHandle, ipcMainRemove, ipcMainSend } from '../../ipc'
import { Module } from '../module'

function unpackedShallowRef<T>(t: T) {
  return shallowRef(t) as unknown as T
}

interface MaaFrameworkConfig {
  host?: string
  port?: number
  path?: string
  debug?: boolean
}

let context: BackendContext | null = null
let backend: Backend
let frontend: Frontend

export class MaaFrameworkModule extends Module {
  name = 'MaaFramework'
  channels = [
    {
      name: 'running',
      desc: 'use prelaunch MaaFramework.MaaRpcCli'
    },
    {
      name: 'external',
      desc: 'use external MaaFramework.MaaRpcCli'
    }
  ]

  channel = 'running'
  version = 'N/A'
  proc = unpackedShallowRef<ChildProcess | null>(null)

  active = false

  get cfg(): Required<MaaFrameworkConfig> {
    return {
      host: 'localhost',
      port: 8080,
      path: 'MaaRpcCli',
      debug: false,
      ...(this.config ?? {})
    }
  }

  async load() {
    await this.unload()
    this.loaded = false
    switch (this.channel) {
      case 'running':
        if (await this.connect()) {
          this.loaded = true
          return true
        } else {
          return false
        }
      case 'external': {
        this.proc = spawn(this.cfg.path, ['-mi', `-h=${this.cfg.host}`, `-p=${this.cfg.port}`], {
          stdio: ['pipe', 'pipe', 'inherit'],
          windowsHide: true
        })
        await new Promise<void>(resolve => {
          this.proc?.stdout?.on('data', (chunk: Buffer) => {
            const row = chunk.toString('utf-8')
            const m = /^\[MAARPC\](.+)\r?\n/.exec(row)
            if (m) {
              const info = m[1]!
              if (info.startsWith('START|')) {
                resolve()
              } else if (info === 'STOP') {
                this.unload()
              }
            }
            console.log(row)
          })
        })
        if (await this.connect()) {
          this.loaded = true
          return true
        } else {
          this.proc?.stdin?.write('\n')
          return false
        }
      }
    }
    return false
  }

  async unload() {
    await this.disconnect()
    if (this.proc) {
      this.proc.stdin?.write('\n')
      this.proc = null
    }
    this.loaded = false
    return true
  }

  async update(channel: string): Promise<boolean> {
    switch (channel) {
      case 'running':
      case 'external':
      default:
        return false
    }
  }

  async upgrade() {
    return false
  }

  async connect() {
    if (this.active) {
      await this.disconnect()
    }
    context = setupContext(`${this.cfg.host}:${this.cfg.port}`)
    if (await waitClientReady(context)) {
      logger.info('maa inited')
      const [invokeHandler, backAdapter, frontAdapter] = streamAdapterBackendWithDirect(
        (msg, arg, id) => {
          ipcMainSend('renderer.loader.stream', msg, arg, id)
        }
      )

      backend = new Backend(backAdapter)
      frontend = new Frontend(frontAdapter)

      backend.init()
      frontend.init()

      backend.add_all(context, definitions)
      frontend.add_all(definitions)

      setFrontend(frontend)
      ipcMainHandle('main.loader.stream', (_, msg, arg, id) => {
        return invokeHandler(msg, arg, id)
      })

      await set_log_dir(path.join(process.cwd(), 'debug'))
      await set_save_draw(this.cfg.debug)
      logger.info('maa configured')
      this.active = true
      return true
    } else {
      destroyContext(context)
      context = null
      logger.error('maa init failed')
      return false
    }
  }

  async disconnect() {
    ipcMainRemove('main.loader.stream')
    this.active = false
    if (context) {
      context = null
    }
  }
}
