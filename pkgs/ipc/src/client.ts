import { SyncVarInterfaceList_M2R } from './sync'

export type ClientSideInterface = {
  'renderer.core.log': (s: string) => void
} & SyncVarInterfaceList_M2R
