<script setup lang="ts">
import { NButton, NCard } from 'naive-ui'
import { computed, ref } from 'vue'

import { curDevice } from './state'

import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useController } from '@/stores/controller'
import { useDevice } from '@/stores/device'
import { translateCallback } from '@/utils/translog'

const statusMessage = ref<string[]>([])

const { device } = useDevice
const { connect, find, handles } = useController

const info = computed(() => {
  if (curDevice.value !== null) {
    if (typeof curDevice.value === 'number') {
      return device.value[curDevice.value]!
    } else {
      return handles.value[curDevice.value]!.cfg
    }
  } else {
    return null
  }
})

const loading = ref(false)

async function requestConnect() {
  if (info.value) {
    loading.value = true
    await connect(info.value, processControllerCallback)
    loading.value = false
  }
}

function processControllerCallback(msg: string, detail: string) {
  statusMessage.value.push(translateCallback(msg, detail))
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <template v-if="info">
      <NCard title="信息">
        <GridFormLayout>
          <span> 名称 </span>
          <span>{{ info.name }}</span>
          <span> ADB路径 </span>
          <span>{{ info.adb_path }}</span>
          <span> 目标地址 </span>
          <span>{{ info.adb_serial }}</span>
        </GridFormLayout>
      </NCard>
      <NCard title="连接">
        <div class="flex flex-col gap-2">
          <div class="flex gap-2">
            <NButton v-if="find(info.adb_serial)" disabled>
              已连接 - {{ find(info.adb_serial) }}
            </NButton>
            <NButton v-else @click="requestConnect" :disabled="loading"> 连接 </NButton>
          </div>
          <div class="flex flex-col gap-2">
            <span v-for="(msg, idx) in statusMessage" :key="idx"> {{ msg }} </span>
          </div>
        </div>
      </NCard>
    </template>
    <div v-else class="flex items-center justify-center">
      <span>选择一个设备</span>
    </div>
  </div>
</template>
