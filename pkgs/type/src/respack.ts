export type RespackControlOption = {
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

export type RespackRepo = {
  resource: Record<string, string>
}

export type RespackControl = {
  option: {
    [key: string]: RespackControlOption
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

export type RespackCustom = {}

export type RespackResourceTarget = {
  name: string
  description?: string
  extends?: string
  path: string
}

export type RespackResource = {
  resource: Record<string, RespackResourceTarget>
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

export interface RespackInfo {
  name: string
  path: string
  type: 'direct' | 'repo'
  link: 'direct' | 'redirect'
  config: {
    repo: RespackRepo
    control: RespackControl
    custom?: RespackCustom
    resource: RespackResource
  }
}
