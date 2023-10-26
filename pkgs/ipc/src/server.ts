import { ControllerHandle, InstanceHandle } from '@maa/loader'
import { ControllerHandleInfo, GlobalConfig, InstanceHandleInfo } from '@maa/type'

import { SyncVarInterfaceList_R2M, SyncVarPullInterfaceList_M2R } from './sync'

export type ServerSideInterface = {
  'main.core.log': (s: string) => void

  'main.module.load': (name: string) => boolean
  'main.module.unload': (name: string) => void
  'main.module.set_channel': (name: string, ch: string) => boolean
  'main.module.set_config': (name: string, cfg: unknown) => boolean

  'main.resource.refresh': () => void
  'main.resource.rename': (from: string, to: string) => boolean
  'main.resource.delete': (name: string) => boolean
  'main.resource.import_repo': (name: string, repo: string) => boolean
  'main.resource.import_dir': (name: string, dir: string) => boolean
  'main.resource.join_path': (res: string, path: string) => string

  'main.reload.fetch_controllers': () => Record<ControllerHandle, ControllerHandleInfo>
  'main.reload.fetch_instances': () => Record<InstanceHandle, InstanceHandleInfo>

  'main.config.fetch_global': () => GlobalConfig

  'main.loader.stream': (cmd: string, args: any[]) => Promise<any>
} & SyncVarInterfaceList_R2M &
  SyncVarPullInterfaceList_M2R
