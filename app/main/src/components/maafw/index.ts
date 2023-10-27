import { FlatToStream, context, deinit, init, set_debug_mode, set_logging } from '@maa/loader'
import { ShallowRef, shallowRef } from '@vue/reactivity'
import { ChildProcess, spawn } from 'child_process'
import path from 'path'

import { ipcMainHandle, ipcMainRemove, ipcMainSend } from '../../ipc'
import { Module } from '../module'

function unpackedShallowRef<T>(t: T) {
  return shallowRef(t) as unknown as T
}

interface MaaFrameworkChannelConfig {
  host?: string
  port?: number
  path?: string
}

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

  get cfg(): Required<MaaFrameworkChannelConfig> {
    return {
      host: 'localhost',
      port: 8080,
      path: 'MaaRpcCli',
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
        // setTimeout(() => {
        //   console.log(this.proc, 'try auto stop maarpc')
        //   this.proc?.kill('SIGINT')
        // }, 10000)
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
    if (await init(`${this.cfg.host}:${this.cfg.port}`)) {
      const stream = FlatToStream(context, (id, msg, detail) => {
        ipcMainSend('renderer.loader.callback', id, msg, detail)
      })
      ipcMainHandle('main.loader.stream', async (_, cmd, args) => {
        try {
          return await stream(cmd, args)
        } catch (err) {
          console.log('Failed to call', cmd, ...args)
          console.log(err)
          throw err
        }
      })
      this.active = true
      await set_logging(path.join(process.cwd(), 'debug'))
      return true
    } else {
      return false
    }
  }

  async disconnect() {
    ipcMainRemove('main.loader.stream')
    this.active = false
    await deinit()
  }
}
