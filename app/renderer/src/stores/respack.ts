import { ref } from 'vue'

import { registerRecv } from '@/sync'

const info = registerRecv('resource_info', {})
const selected = ref<string | null>(null)

export const useResPack = {
  info,
  selected
}
