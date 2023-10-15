import { SyncVarInterfaceList_M2R, SyncVarPullInterfaceList_R2M } from './sync'

export type ClientSideInterface = {
  'renderer.core.log': (s: string) => void

  'renderer.loader.callback': (id: string, msg: string, detail: string) => void
} & SyncVarInterfaceList_M2R &
  SyncVarPullInterfaceList_R2M
