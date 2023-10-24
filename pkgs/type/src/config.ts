import type { DeviceInfo } from '@maa/loader'

import type { InstanceSaveInfo } from './handle'

export type GlobalConfig = {
  debug_mode?: boolean
  known_devices?: DeviceInfo[]
  preset_instance?: Record<string, InstanceSaveInfo>
}
