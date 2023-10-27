import { setupMaa } from '@/utils/maa'

import { useConfig } from './config'
import { useController } from './controller'
import { useInstance } from './instance'

export function register_init_logic() {
  useConfig.reload_init()
  useController.reload_init()
  useInstance.reload_init()

  setupMaa()
}
