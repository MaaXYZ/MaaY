<script setup lang="ts">
import { deviceInfo } from '@/stores/device'
import { NButton } from 'naive-ui'

function refresh() {
  window.ipcRenderer.invoke('main.loader.device.update')
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div>
      <NButton @click="refresh">refresh</NButton>
    </div>
    <div v-for="(item, idx) of deviceInfo" :key="idx" class="flex gap-2">
      <span> {{ item.name }} </span>
      <span> {{ item.adb_serial }} </span>
    </div>
  </div>
</template>
