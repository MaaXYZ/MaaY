import Config from './Config.vue'

import { useController } from '@/stores/controller'
import { useInstance } from '@/stores/instance'

async function beforeUnload() {
  await useInstance.destroy_all()
  await useController.disconnect_all()
}

export default {
  Config,
  beforeUnload
}
