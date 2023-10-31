<script setup lang="ts">
import { NButton, NCard } from 'naive-ui'
import { computed, ref } from 'vue'

import { useTr } from '@/i18n'
import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useController } from '@/stores/controller'
import { useDevice } from '@/stores/device'
import { maaactive } from '@/utils/maa'
import { translateCallback } from '@/utils/translog'

import { curDevice } from './state'

const { t } = useTr()

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
  <div v-if="info" class="flex flex-col gap-2">
    <NCard :title="t('device.info.title')">
      <GridFormLayout>
        <span> {{ t('device.info.name') }} </span>
        <span> {{ info.name }} </span>
        <span> {{ t('device.info.adb_path') }} </span>
        <span> {{ info.adb_path }} </span>
        <span> {{ t('device.info.target_address') }} </span>
        <span> {{ info.adb_serial }} </span>
      </GridFormLayout>
    </NCard>
    <NCard :title="t('device.connect.title')">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <NButton v-if="find(info.adb_serial)" disabled>
            {{ t('device.connect.connected') }} - {{ find(info.adb_serial) }}
          </NButton>
          <NButton v-else @click="requestConnect" :loading="loading" :disabled="!maaactive">
            {{ t('device.connect.connect') }}
          </NButton>
        </div>
        <div class="flex flex-col gap-2">
          <span v-for="(msg, idx) in statusMessage" :key="idx"> {{ msg }} </span>
        </div>
      </div>
    </NCard>
  </div>
  <div v-else class="flex items-center justify-center">
    <span> {{ t('device.hint.choose') }} </span>
  </div>
</template>
