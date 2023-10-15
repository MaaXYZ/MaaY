export interface ModuleUpgradeChannel {
  name: string
  desc: string
}

export abstract class Module {
  abstract readonly name: string
  abstract readonly channels: ModuleUpgradeChannel[]

  loaded = false
  channel?: string
  channel_config?: unknown
  version?: string
  update_version?: string

  abstract load(): Promise<boolean>
  abstract unload(): Promise<void>
  abstract update(channel: string): Promise<boolean>
  abstract upgrade(): Promise<boolean>
}