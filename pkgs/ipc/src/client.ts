import { SyncVarInterfaceList_M2R, SyncVarPullInterfaceList_R2M } from './sync'

export type ClientSideInterface = {
  'renderer.core.log': (s: string) => void

  'renderer.loader.controller.callback': (msg: string, detail: string) => void
} & SyncVarInterfaceList_M2R &
  SyncVarPullInterfaceList_R2M
