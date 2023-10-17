export interface ModuleUpgradeChannel {
  name: string
  desc: string
}

export interface ModuleInfo {
  readonly name: string
  readonly channels: ModuleUpgradeChannel[]

  loaded: boolean
  channel?: string
  channel_config?: unknown
  version?: string
  update_version?: string
}

export type ResourceControl = {
  option: {
    [key: string]: {
      name: string
    } & (
      | {
          type: 'checkbox'
          inject?: string[]
          case?: {
            true?: unknown
            false?: unknown
          }
        }
      | {
          type: 'select_string'
          default?: string
          inject?: string[]
          case?: {
            name: string
            value: string
            provide: unknown
          }[]
        }
      | {
          type: 'select_number'
          default?: number
          inject?: string[]
          case?: {
            name: string
            value: number
            provide: unknown
          }[]
        }
      | {
          type: 'input_string'
          default?: string
          inject?: string[]
        }
      | {
          type: 'input_number'
          default?: number
          inject?: string[]
        }
    )
  }
}

export type ResourceCustom = {}

export type ResourceResource = {
  resource: {
    [key: string]: {
      name: string
      description?: string
      path: string
    }
  }
  app: {
    start?: string
    stop?: string
    orientation?: 'portait' | 'landscape'
    size?:
      | {
          short: number
          long?: never
        }
      | {
          short?: never
          long: number
        }
  }
}

export interface ResourceInfo {
  name: string
  path: string
  config: {
    control: ResourceControl
    custom?: ResourceCustom
    resource: ResourceResource
  }
}
