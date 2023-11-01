import type { SyncVarInterfaceList_M2R, SyncVarPullInterfaceList_R2M } from './sync'

export type ClientSideInterface = {
  'renderer.core.log': (s: string) => void

  'renderer.loader.callback': (msg: string, id: string, ...args: any[]) => void
} & SyncVarInterfaceList_M2R &
  SyncVarPullInterfaceList_R2M
