<script setup lang="ts">
import { NSelect } from 'naive-ui'
import { computed } from 'vue'

import { useRespack } from '@/stores/respack'

const props = defineProps<{
  res?: string
  pack?: string
}>()

const emits = defineEmits<{
  'update:res': [string]
}>()

const info = computed(() => {
  return props.pack ? useRespack.info.value[props.pack] ?? null : null
})

const option = computed(() => {
  return info.value
    ? Object.entries(info.value.config.resource.resource).map(([k, v]) => ({
        label: v.name,
        value: k
      }))
    : []
})
</script>

<template>
  <NSelect
    :value="props.res ?? ''"
    @update:value="v => emits('update:res', v)"
    :options="option"
    placeholder="选择一个资源包"
  ></NSelect>
</template>
