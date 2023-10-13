import { Device } from '@maa/loader'

import { ipcMainHandle } from '.'
import { status } from '../stores'
import { registerSend } from '../sync'

export function setupLoader() {
  const deviceInfo = registerSend('device', [])

  ipcMainHandle('main.loader.device.update', async () => {
    if (status.RpcActive) {
      deviceInfo.value = await Device.find()
    }
  })
}
