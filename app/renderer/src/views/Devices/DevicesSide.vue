<script setup lang="ts">
import type { ControllerHandle } from '@maa/loader'
import { NButton, NCard } from 'naive-ui'
import { computed, ref } from 'vue'

import { curDevice, foundDevices } from './state'

import { useController } from '@/stores/controller'
import { useDevice } from '@/stores/device'

const { refresh } = useDevice

const loading = ref(false)

const connectDevices = computed(() => {
  return Object.keys(useController.handles.value) as ControllerHandle[]
})

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
    <NCard title="已连接" :theme-overrides="{ color: 'transparent' }">
      <div class="flex flex-col gap-2">
        <NButton
          v-for="(item, idx) of connectDevices"
          :key="idx"
          @click="curDevice = item"
          secondary
          :type="curDevice === item ? 'primary' : 'default'"
        >
          <div class="flex gap-2">
            <span> {{ useController.handles.value[item]!.name }} </span>
            <span> {{ useController.handles.value[item]!.cfg.adb_serial }} </span>
          </div>
        </NButton>
      </div>
    </NCard>
    <NCard title="新设备" :theme-overrides="{ color: 'transparent' }">
      <div class="flex flex-col gap-2">
        <NButton
          v-for="(item, idx) of foundDevices"
          :key="idx"
          @click="curDevice = idx"
          secondary
          :type="curDevice === idx ? 'primary' : 'default'"
        >
          <div class="flex gap-2">
            <span> {{ item.name }} </span>
            <span> {{ item.adb_serial }} </span>
          </div>
        </NButton>
      </div>
    </NCard>
  </div>
</template>
