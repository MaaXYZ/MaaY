import {
  type ControllerHandle,
  Instance,
  type InstanceHandle,
  Resource,
  type ResourceHandle
} from '@maa/loader'
import { ref } from 'vue'

const handles = ref<
  Record<
    InstanceHandle,
    {
      name: string
      resource: {
        handle: ResourceHandle
        name: string
        resource?: string
        entry?: number
        config: Record<string, string | number | boolean>
      }
      controller: {
        handle?: ControllerHandle
      }
    }
  >
>({})

const selected = ref<InstanceHandle | null>(null)

async function create(cb: (msg: string, detail: string) => void, name: string, respack: string) {
  const inst = await Instance.init(cb)
  const res = await Resource.init(cb)
  handles.value[inst.handle] = {
    name,
    resource: {
      handle: res.handle,
      name: respack,
      config: {}
    },
    controller: {}
  }
  return inst
}

export const useInstance = {
  handles,
  selected,

  create
}
