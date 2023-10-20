import type { InstanceHandle } from '@maa/loader'
import { ref } from 'vue'

export const selectedInstance = ref<InstanceHandle | null>(null)
