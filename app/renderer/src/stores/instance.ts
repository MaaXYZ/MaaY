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
      extra: {
        callback: (msg: string, detail: string) => void
      }
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

async function create(name: string, respack: string) {
  const extra: {
    callback: (msg: string, detail: string) => void
  } = {
    callback: () => void 0
  }
  const inst = await Instance.init((msg, detail) => extra.callback(msg, detail))
  const res = await Resource.init((msg, detail) => extra.callback(msg, detail))
  handles.value[inst.handle] = {
    name,
    extra,
    resource: {
      handle: res.handle,
      name: respack,
      config: {}
    },
    controller: {}
  }
  return inst
}

async function destroy(handle: InstanceHandle) {
  const rh = handles.value[handle]!.resource.handle
  delete handles.value[handle]
  await Instance.init_from(handle).destroy()
  await Resource.init_from(rh).destroy()
}

export const useInstance = {
  handles,

  create,
  destroy
}
