import { useController } from '@/stores/controller'
import { useInstance } from '@/stores/instance'

import Config from './Config.vue'

async function beforeUnload() {
  await useInstance.destroy_all()
  await useController.disconnect_all()
}

export default {
  Config,
  beforeUnload
}
