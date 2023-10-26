import type { ControllerHandle, DeviceInfo, InstanceHandle, ResourceHandle } from '@maa/loader'

export type ControllerHandleInfo = {
  cb: string

  name: string
  cfg: DeviceInfo
}

export type InstanceSaveInfo = {
  runtime?: unknown

  id: string
  name: string
  resource: {
    name: string
    target?: string

    config: Record<string, unknown>
    entries: {
      entry: number
      config: Record<string, unknown>
    }[]
  }
}

export type InstanceHandleInfo = InstanceSaveInfo & {
  runtime: {
    controller?: ControllerHandle
    resource: {
      handle: ResourceHandle
      cb: string
    }
    instance: {
      handle: InstanceHandle
      cb: string
    }
  }
}
