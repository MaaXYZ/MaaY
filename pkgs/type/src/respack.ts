export type ResourceControlOption = {
  name: string
} & (
  | {
      type: 'checkbox'
      default?: boolean
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
      case: {
        name: string
        value: string
        provide?: unknown
      }[]
    }
  | {
      type: 'select_number'
      default?: number
      inject?: string[]
      case: {
        name: string
        value: number
        provide?: unknown
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

export type ResourceControl = {
  option: {
    [key: string]: ResourceControlOption
  }
  global?: {
    option?: string[]
  }
  entry: {
    name: string
    task: string
    option?: string[]
    provide?: unknown
  }[]
}

export type ResourceCustom = {}

export type ResourceResource = {
  resource: {
    [key: string]: {
      name: string
      description?: string
      extends?: string
      path: string
    }
  }
  app: {
    start?: string
    stop?: string
    orientation?: 'portrait' | 'landscape'
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
