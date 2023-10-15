import { Controller, Device, Instance, Resource, Status } from '@maa/loader'
import { computed } from '@vue/reactivity'

import { ipcMainHandle, ipcMainSend } from '.'
import { moduleIndexs } from '../components'
import { registerSend, registerSendFor } from '../sync'

export function setupLoader() {
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
