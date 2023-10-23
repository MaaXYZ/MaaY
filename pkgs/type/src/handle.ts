import type { ControllerHandle, DeviceInfo, ResourceHandle } from '@maa/loader'

export type ControllerHandleInfo = {
  cb: string

  name: string
  cfg: DeviceInfo
}

export type InstanceHandleInfo = {
  cb: string

  name: string
  resource: {
    handle: ResourceHandle
    cb: string

    name: string
    resource?: string

    config: Record<string, unknown>
    entries: {
      entry: number
      config: Record<string, unknown>
    }[]
  }
  controller?: ControllerHandle
}
