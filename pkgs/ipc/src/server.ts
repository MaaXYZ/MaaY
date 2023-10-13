import { SyncVarInterfaceList_R2M, SyncVarPullInterfaceList_M2R } from './sync'

export type ServerSideInterface = {
  'main.core.log': (s: string) => void

  'main.loader.utility.version': () => string

  'main.loader.device.update': () => void
} & SyncVarInterfaceList_R2M &
  SyncVarPullInterfaceList_M2R
