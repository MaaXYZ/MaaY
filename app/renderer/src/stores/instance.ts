import {
  type ControllerHandle,
  Instance,
  type InstanceHandle,
  Resource,
  type ResourceHandle
} from '@maa/loader'
import type { InstanceHandleInfo } from '@maa/type'
import { ref } from 'vue'

const handles = ref<Record<InstanceHandle, InstanceHandleInfo>>({})

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
    obj: inst,
    extra,
    resource: {
      handle: res.handle,
      obj: res,
      name: respack,
      config: {}
    },
    controller: {}
  }
  return inst
}

async function destroy(handle: InstanceHandle) {
  const ii = handles.value[handle]!
  delete handles.value[handle]
  await ii.obj.destroy()
  await ii.resource.obj.destroy()
}

export const useInstance = {
  handles,

  create,
  destroy
}
