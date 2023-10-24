import type { ControllerHandle } from '@maa/loader'
import { computed, ref } from 'vue'

import { useController } from '@/stores/controller'
import { useDevice } from '@/stores/device'

const { handles, find } = useController

export const curDevice = ref<number | ControllerHandle | null>(null)

export const foundDevices = computed(() => {
  return useDevice.device.value.filter(x => {
    return !find(x.adb_serial)
  })
})

export const connectDevices = computed(() => {
  return Object.keys(handles.value) as ControllerHandle[]
})
