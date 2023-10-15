<script setup lang="ts">
import { loader_info } from '@/stores/loader'
</script>

<template>
  <div class="flex">
    <span>
      MaaFramework: {{ loader_info.active ? `已连接 ${loader_info.address}` : '已断开' }}
    </span>
  </div>
</template>
