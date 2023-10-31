import pkg from '../../../../../package.json'
import { Module } from '../module'

interface MaaYConfig {
  locale?: 'zh_CN' | 'en'
}

export class MaaYModule extends Module {
  name = 'MaaY'
  channels = [
    {
      name: 'stable',
      desc: 'never upgrade MaaY'
    }
  ]

  channel = 'stable'
  version = pkg.version

  active = false

  get cfg(): Required<MaaYConfig> {
    return {
      locale: 'zh_CN',
      ...(this.config ?? {})
    }
  }

  async load() {
    this.loaded = true
    return true
  }

  async unload() {
    return false
  }

  async update(channel: string): Promise<boolean> {
    switch (channel) {
      case 'stable':
      default:
        return false
    }
  }

  async upgrade() {
    return false
  }
}
