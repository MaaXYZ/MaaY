import { registerRecv } from '@/sync'
import { ref } from 'vue'

export const deviceInfo = registerRecv('device', [])
export const selectedDeviceInfo = ref<number | null>(null)
