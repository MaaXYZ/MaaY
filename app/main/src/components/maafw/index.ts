import { FlatToStream, context, deinit, init, set_debug_mode, set_logging } from '@maa/loader'
import { ShallowRef, shallowRef } from '@vue/reactivity'
import { ChildProcess, spawn } from 'child_process'
import path from 'path'

import { ipcMainHandle, ipcMainRemove, ipcMainSend } from '../../ipc'
import { Module } from '../module'

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
  proc: ChildProcess | null = shallowRef<ChildProcess | null>(
    null
  ) as unknown as ChildProcess | null

  active = false

  get cfg(): Required<MaaFrameworkChannelConfig> {
    return {
      host: '0.0.0.0',
      port: 8080,
      path: 'MaaRpcCli',
      ...(this.channel_config ?? {})
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
        this.proc = spawn(this.cfg.path, {
          stdio: 'inherit'
        })
        await new Promise((resolve, reject) => {
          this.proc!.on('spawn', resolve)
          this.proc!.on('error', reject)
        })
        if (await this.connect()) {
          this.loaded = true
          return true
        } else {
          this.proc.kill('SIGINT')
          return false
        }
      }
    }
    return false
  }

  async unload() {
    await this.disconnect()
    if (this.proc) {
      this.proc.kill('SIGINT')
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
      ipcMainHandle('main.loader.stream', (_, cmd, args) => stream(cmd, args))
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
