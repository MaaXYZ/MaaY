import type { InstanceHandle } from '@maa/loader'
import { computed, ref } from 'vue'

import { useConfig } from '@/stores/config'
import { useInstance } from '@/stores/instance'
import { useRespack } from '@/stores/respack'

const { global } = useConfig

const { is_created, handles } = useInstance

export function isInstance(id: InstanceHandle | string | null): id is InstanceHandle {
  return (curInstanceHandle.value as InstanceHandle) in handles.value
}

export const curInstanceHandle = ref<InstanceHandle | string | null>(null)
export const curInstanceSaveInfo = computed(() => {
  if (!curInstanceHandle.value) {
    return null
  }
  if (isInstance(curInstanceHandle.value)) {
    return curInstanceInfo.value
  } else if (curInstanceHandle.value in (global.value.preset_instance ?? {})) {
    return global.value.preset_instance![curInstanceHandle.value]!
  } else {
    return null
  }
})
export const curInstanceInfo = computed(() => {
  return isInstance(curInstanceHandle.value) ? handles.value[curInstanceHandle.value] ?? null : null
})
export const curInstanceRespackInfo = computed(() => {
  return curInstanceSaveInfo.value
    ? useRespack.info.value[curInstanceSaveInfo.value.resource.name] ?? null
    : null
})

export const notCreatedInstances = computed(() => {
  return Object.keys(global.value.preset_instance ?? {}).filter(i => !is_created(i))
})
