import { type AdbControllerConfig, Controller, type ControllerHandle } from '@maa/loader'
import type { ControllerHandleInfo } from '@maa/type'
import { reactive } from 'vue'

const handles = reactive<Record<ControllerHandle, ControllerHandleInfo>>({})

async function connect(
  cb: (msg: string, detail: string) => void,
  name: string,
  cfg: AdbControllerConfig
) {
  try {
    const ctrl = await Controller.initAdb(cb, cfg)
    await ctrl.post_connection().wait()
    if (await ctrl.connected) {
      handles[ctrl.handle] = {
        name,
        cfg,
        obj: ctrl
      }
      return ctrl
    } else {
      await ctrl.destroy()
      return null
    }
  } catch (_) {
    return null
  }
}

function find(serial?: string) {
  for (const [handle, info] of Object.entries(handles)) {
    if (info.cfg.serial === serial) {
      return handle
    }
  }
  return null
}

export const useController = {
  handles,

  connect,
  find
}
