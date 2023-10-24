import { Device, type DeviceInfo } from '@maa/loader'
import { computed, ref } from 'vue'

import { useConfig } from './config'

const foundDevices = ref<DeviceInfo[]>([])

function mergeDevices(known: DeviceInfo[], found: DeviceInfo[]) {
  return [
    ...known.filter(x => found.findIndex(y => x.adb_serial === y.adb_serial) === -1),
    ...found
  ]
}

const device = computed<DeviceInfo[]>(() => {
  return mergeDevices(useConfig.global.value.known_devices ?? [], foundDevices.value)
})

async function refresh() {
  foundDevices.value = await Device.find()
}

export const useDevice = {
  device,

  refresh
}
