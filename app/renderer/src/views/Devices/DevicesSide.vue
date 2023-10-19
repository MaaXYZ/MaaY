<script setup lang="ts">
import { useDevice } from '@/stores/device'
import { NButton } from 'naive-ui'
import { ref } from 'vue'

import { selectedDevice } from './state'

const { device, refresh } = useDevice

const loading = ref(false)

function doRefresh() {
  loading.value = true
  refresh().then(() => {
    loading.value = false
  })
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-center">
      <NButton @click="doRefresh" :disabled="loading">刷新</NButton>
    </div>
    <NButton v-for="(item, idx) of device" :key="idx" @click="selectedDevice = idx">
      <div class="flex gap-2">
        <span> {{ item.name }} </span>
        <span> {{ item.adb_serial }} </span>
      </div>
    </NButton>
  </div>
</template>
