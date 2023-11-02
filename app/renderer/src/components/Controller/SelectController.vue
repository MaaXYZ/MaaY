<script setup lang="ts">
import type { ControllerHandle } from '@maa/loader'
import { NSelect } from 'naive-ui'
import { computed } from 'vue'

import { useController } from '@/stores/controller'

defineProps<{
  handle?: ControllerHandle | null
}>()

const emits = defineEmits<{
  'update:handle': [ControllerHandle]
}>()

const option = computed(() => {
  return Object.entries(useController.handles.value).map(([ctrl, info]) => ({
    label: info.cfg.adb_serial ?? '127.0.0.1:5555',
    value: ctrl
  }))
})
</script>

<template>
  <NSelect
    :value="handle"
    @update:value="v => emits('update:handle', v)"
    :options="option"
    placeholder="选择一个设备"
  ></NSelect>
</template>
