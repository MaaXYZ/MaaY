import { type AdbControllerConfig, Controller, type ControllerHandle } from '@maa/loader'
import { ref } from 'vue'

const handles = ref<Record<ControllerHandle, AdbControllerConfig>>({})

async function connect(cb: (msg: string, detail: string) => void, cfg: AdbControllerConfig) {
  const ctrl = await Controller.initAdb(cb, cfg)
  await ctrl.post_connection().wait()
  if (await ctrl.connected) {
    handles.value[ctrl.handle] = cfg
    return ctrl
  } else {
    await ctrl.destroy()
    return null
  }
}

function find(serial?: string) {
  for (const [handle, cfg] of Object.entries(handles.value)) {
    if (cfg.serial === serial) {
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
