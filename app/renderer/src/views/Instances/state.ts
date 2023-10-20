import type { InstanceHandle } from '@maa/loader'
import { computed, ref } from 'vue'

import { useInstance } from '@/stores/instance'
import { useRespack } from '@/stores/respack'

export const curInstanceHandle = ref<InstanceHandle | null>(null)
export const curInstanceInfo = computed(() => {
  return curInstanceHandle.value ? useInstance.handles.value[curInstanceHandle.value] ?? null : null
})
export const curInstanceRespackInfo = computed(() => {
  return curInstanceInfo.value
    ? useRespack.info.value[curInstanceInfo.value.resource.name] ?? null
    : null
})
