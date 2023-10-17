import { SyncVarInterfaceList_R2M, SyncVarPullInterfaceList_M2R } from './sync'

export type ServerSideInterface = {
  'main.core.log': (s: string) => void

  'main.module.load': (name: string) => boolean
  'main.module.unload': (name: string) => void
  'main.module.set_channel': (name: string, ch: string) => boolean

  'main.resource.refresh': () => void
  'main.resource.join_path': (res: string, path: string) => Promise<string>

  'main.loader.stream': (cmd: string, args: any[]) => Promise<any>
} & SyncVarInterfaceList_R2M &
  SyncVarPullInterfaceList_M2R
