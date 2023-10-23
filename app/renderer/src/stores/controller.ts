import {
  type AdbControllerConfig,
  Controller,
  type ControllerHandle,
  type DeviceInfo
} from '@maa/loader'

import { registerSend } from '@/sync'

const handles = registerSend('controllers', {}, false)

window.ipcRenderer.invoke('main.reload.fetch_controllers').then(obj => {
  handles.value = JSON.parse(obj)
})

async function connect(cfg: DeviceInfo, cb: (msg: string, detail: string) => void) {
  const { name, adb_path: path, adb_serial: serial, adb_type: type, adb_config: config } = cfg
  const ctrl = await Controller.initAdb({
    path,
    serial,
    type,
    config
  })
  ctrl.onCallback = cb
  await ctrl.post_connection().wait()
  if (await ctrl.connected) {
    handles.value[ctrl.handle] = {
      cb: ctrl.cbId,

      name,
      cfg
    }
    return ctrl
  } else {
    await ctrl.destroy()
    return null
  }
}

function find(serial?: string) {
  for (const [handle, info] of Object.entries(handles.value)) {
    if (info.cfg.adb_serial === serial) {
      return handle
    }
  }
  return null
}

function init_from(handle: ControllerHandle) {
  return Controller.init_from(handle, handles.value[handle]!.cb)
}

export const useController = {
  handles,

  connect,
  find,
  init_from
}
