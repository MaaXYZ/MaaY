import { deinit, init, set_debug_mode, set_logging } from '@maa/loader'
import { ChildProcess, spawn } from 'child_process'
import path from 'path'

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
  proc: ChildProcess | null = null

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
      this.active = true
      await set_logging(path.join(process.cwd(), 'debug'))
      return true
    } else {
      return false
    }
  }

  async disconnect() {
    this.active = false
    await deinit()
  }
}
