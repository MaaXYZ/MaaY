import { registerRecv } from '@/sync'
import { ref } from 'vue'

const info = registerRecv('resource_info', {})
const selected = ref<string | null>(null)

export const useResPack = {
  info,
  selected
}
