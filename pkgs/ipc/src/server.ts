import type { AdbControllerConfig } from '@maa/loader'

import { SyncVarInterfaceList_R2M, SyncVarPullInterfaceList_M2R } from './sync'

export type ServerSideInterface = {
  'main.core.log': (s: string) => void

  'main.loader.utility.version': () => string

  'main.loader.device.update': () => void
  'main.loader.controller.connect': (cfg: Required<AdbControllerConfig>) => boolean

  'main.loader.instance.load': (pack: string) => boolean
} & SyncVarInterfaceList_R2M &
  SyncVarPullInterfaceList_M2R
