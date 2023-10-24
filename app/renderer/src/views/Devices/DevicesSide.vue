<script setup lang="ts">
import type { ControllerHandle, DeviceInfo } from '@maa/loader'
import { Star24Filled, Star24Regular } from '@vicons/fluent'
import { NButton, NCard, NIcon } from 'naive-ui'
import { computed, ref } from 'vue'

import { connectDevices, curDevice, foundDevices } from './state'

import { useConfig } from '@/stores/config'
import { useController } from '@/stores/controller'
import { useDevice } from '@/stores/device'

const { refresh } = useDevice
const { handles } = useController
const { global } = useConfig

const loading = ref(false)

function doRefresh() {
  loading.value = true
  refresh().then(() => {
    loading.value = false
  })
}

function isSaved(serial: string) {
  return !!global.value.known_devices?.find(x => x.adb_serial === serial)
}

function addSaved(cfg: DeviceInfo) {
  global.value.known_devices = [...(global.value.known_devices ?? []), cfg]
}

function dropSaved(serial: string) {
  const idx = global.value.known_devices?.findIndex(x => x.adb_serial === serial) ?? -1
  if (idx !== -1) {
    global.value.known_devices?.splice(idx, 1)
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-center">
      <NButton @click="doRefresh" :disabled="loading">刷新</NButton>
    </div>
    <NCard title="已连接" :theme-overrides="{ color: 'transparent' }">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2" v-for="(item, idx) of connectDevices" :key="idx">
          <NButton
            @click="curDevice = item"
            secondary
            :type="curDevice === item ? 'primary' : 'default'"
          >
            <div class="flex gap-2">
              <span> {{ useController.handles.value[item]!.name }} </span>
              <span> {{ useController.handles.value[item]!.cfg.adb_serial }} </span>
            </div>
          </NButton>
          <NButton
            v-if="isSaved(handles[item]!.cfg.adb_serial)"
            @click="
              () => {
                dropSaved(handles[item]!.cfg.adb_serial)
              }
            "
          >
            <template #icon>
              <NIcon>
                <Star24Filled></Star24Filled>
              </NIcon>
            </template>
          </NButton>
          <NButton
            v-else
            @click="
              () => {
                addSaved(handles[item]!.cfg)
              }
            "
          >
            <template #icon>
              <NIcon>
                <Star24Regular></Star24Regular>
              </NIcon>
            </template>
          </NButton>
        </div>
      </div>
    </NCard>
    <NCard title="新设备" :theme-overrides="{ color: 'transparent' }">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2" v-for="(item, idx) of foundDevices" :key="idx">
          <NButton
            @click="curDevice = idx"
            secondary
            :type="curDevice === idx ? 'primary' : 'default'"
          >
            <div class="flex gap-2">
              <span> {{ item.name }} </span>
              <span> {{ item.adb_serial }} </span>
            </div>
          </NButton>
          <NButton
            v-if="isSaved(item.adb_serial)"
            @click="
              () => {
                dropSaved(item.adb_serial)
              }
            "
          >
            <template #icon>
              <NIcon>
                <Star24Filled></Star24Filled>
              </NIcon>
            </template>
          </NButton>
          <NButton
            v-else
            @click="
              () => {
                addSaved(item)
              }
            "
          >
            <template #icon>
              <NIcon>
                <Star24Regular></Star24Regular>
              </NIcon>
            </template>
          </NButton>
        </div>
      </div>
    </NCard>
  </div>
</template>
