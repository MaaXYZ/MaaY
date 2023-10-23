import type { ControllerHandle } from '@maa/loader'
import { computed, ref } from 'vue'

import { useController } from '@/stores/controller'
import { useDevice } from '@/stores/device'

export const curDevice = ref<number | ControllerHandle | null>(null)

export const foundDevices = computed(() => {
  return useDevice.device.value.filter(x => {
    return !useController.find(x.adb_serial)
  })
})
