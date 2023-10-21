import type {
  AdbControllerConfig,
  Controller,
  ControllerHandle,
  Instance,
  Resource,
  ResourceHandle
} from '@maa/loader'

export type ControllerHandleInfo = {
  name: string
  cfg: AdbControllerConfig
  obj: Controller
}

export type InstanceHandleInfo = {
  name: string
  obj: Instance
  extra: {
    callback: (msg: string, detail: string) => void
  }
  resource: {
    handle: ResourceHandle
    obj: Resource
    name: string
    resource?: string

    config: Record<string, unknown>
    entries: {
      entry: number
      config: Record<string, unknown>
    }[]
  }
  controller: {
    handle?: ControllerHandle
  }
}
