export interface ModuleUpgradeChannel {
  name: string
  desc: string
  data?: unknown
}

export abstract class Module {
  abstract readonly name: string
  abstract readonly channels: ModuleUpgradeChannel[]

  loaded = false
  channel: string | null = null
  version: string | null = null
  update_version: string | null = null
  update_data: unknown | null = null

  abstract load(): Promise<boolean>
  abstract unload(): Promise<void>
  abstract update(channel: string): Promise<boolean>
  abstract upgrade(): Promise<boolean>
}
