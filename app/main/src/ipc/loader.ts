import { Device } from '@maa/loader'

import { ipcMainHandle } from '.'
import { moduleIndexs } from '../components'
import { registerSend } from '../sync'

export function setupLoader() {
  const deviceInfo = registerSend('device', [])

  ipcMainHandle('main.loader.device.update', async () => {
    if (moduleIndexs.MaaFramework.active) {
      deviceInfo.value = await Device.find()
    }
  })
}
