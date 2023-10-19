import { Device, type DeviceInfo } from '@maa/loader'
import { ref } from 'vue'

const device = ref<DeviceInfo[]>([])

async function refresh() {
  device.value = await Device.find()
}

export const useDevice = {
  device,

  refresh
}
