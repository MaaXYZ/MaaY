<script setup lang="ts">
import { module_info } from '@/stores/module'
import { computed } from 'vue'

const address = computed(() => {
  const cc = module_info.value.MaaFramework?.channel_config as
    | {
        host?: string
        port?: number
      }
    | undefined
  return {
    host: '0.0.0.0',
    port: 8080,
    ...(cc ?? {})
  }
})
</script>

<template>
  <div class="flex">
    <span>
      MaaFramework:
      {{ module_info.MaaFramework?.loaded ? `已连接 ${address.host}:${address.port}` : '已断开' }}
    </span>
  </div>
</template>
@/stores/modules
