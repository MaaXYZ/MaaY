<script setup lang="ts">
import LoaderInfo from '@/components/LoaderInfo.vue'
import { deviceInfo, selectedDeviceInfo } from '@/stores/device'
import { NButton } from 'naive-ui'

function refresh() {
  window.ipcRenderer.invoke('main.loader.device.update')
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <LoaderInfo></LoaderInfo>
    <div class="flex justify-center">
      <NButton @click="refresh">refresh</NButton>
    </div>
    <NButton v-for="(item, idx) of deviceInfo" :key="idx" @click="selectedDeviceInfo = idx">
      <div class="flex gap-2">
        <span> {{ item.name }} </span>

        <span> {{ item.adb_serial }} </span>
      </div>
    </NButton>
  </div>
</template>
