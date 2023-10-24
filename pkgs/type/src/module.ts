export interface ModuleUpgradeChannel {
  name: string
  desc: string
}

export interface ModuleInfo {
  readonly name: string
  readonly channels: ModuleUpgradeChannel[]

  loaded: boolean
  channel?: string
  config?: unknown
  version?: string
  update_version?: string
}
