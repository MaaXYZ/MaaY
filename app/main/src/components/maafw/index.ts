import { Module } from '../module'

export class MaaFrameworkModule extends Module {
  name = 'MaaFramework'
  channels = [
    {
      name: 'external',
      desc: 'use MaaFramework in path'
    }
  ]

  channel = 'external'
  version = 'N/A'

  async load() {
    this.loaded = true
    return true
  }

  async unload() {
    this.loaded = false
  }

  async update(channel: string): Promise<boolean> {
    switch (channel) {
      case 'external':
      default:
        return false
    }
  }

  async upgrade() {
    return false
  }
}
