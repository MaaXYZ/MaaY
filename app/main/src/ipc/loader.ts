import { Controller, Device, Status } from '@maa/loader'
import { computed } from '@vue/reactivity'

import { ipcMainHandle, ipcMainSend } from '.'
import { moduleIndexs } from '../components'
import { registerSend, registerSendFor } from '../sync'

export function setupLoader() {
  const deviceInfo = registerSend('device', [])
  const controllerSet = registerSend('controller_set', {})

  ipcMainHandle('main.loader.device.update', async () => {
    if (moduleIndexs.MaaFramework.active) {
      deviceInfo.value = await Device.find()
    }
  })

  ipcMainHandle('main.loader.controller.connect', async (_, cfg) => {
    if (cfg.serial in controllerSet.value) {
      return false
    }
    const ctrl = await Controller.initAdb((msg, detail) => {
      ipcMainSend('renderer.loader.controller.callback', msg, detail)
    }, cfg)
    const status = await ctrl.post_connection().wait()
    if (status === Status.Success) {
      controllerSet.value[cfg.serial] = ctrl.handle
      return true
    } else {
      await ctrl.destroy()
      return false
    }
  })

  registerSendFor(
    'loader_info',
    computed(() => {
      return {
        active: moduleIndexs.MaaFramework.active,
        address: `${moduleIndexs.MaaFramework.cfg.host}:${moduleIndexs.MaaFramework.cfg.port}`
      }
    })
  )
}
