<script setup lang="ts">
import { NButton, NCard } from 'naive-ui'
import { computed, ref } from 'vue'

import EditAdbIOType from '@/components/Device/EditAdbIOType.vue'
import LogPanel from '@/components/LogPanel.vue'
import { useTr } from '@/i18n'
import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useController } from '@/stores/controller'
import { useDevice } from '@/stores/device'
import { maaactive } from '@/utils/maa'
import { translateCallback } from '@/utils/translog'

import { curDevice } from './state'

const { t } = useTr()

const loggerEl = ref<InstanceType<typeof LogPanel> | null>(null)

const { device } = useDevice
const { connect, disconnect, find, handles } = useController

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
    await connect(info.value, async (msg, detail) => {
      loggerEl.value?.add(translateCallback(msg, detail))
    })
    loading.value = false
  }
}

async function requestDisconnect() {
  if (info.value) {
    loading.value = true
    const h = find(info.value.adb_serial)
    if (h) {
      await disconnect(h)
    }
    loading.value = false
  }
}
</script>

<template>
  <div v-if="info" class="flex flex-col gap-2">
    <NCard :title="t('device.info.title')">
      <GridFormLayout>
        <span> {{ t('global.name') }} </span>
        <span> {{ info.name }} </span>
        <span> {{ t('device.info.adb_path') }} </span>
        <span> {{ info.adb_path }} </span>
        <span> {{ t('device.info.target_address') }} </span>
        <span> {{ info.adb_serial }} </span>
        <span> {{ t('device.info.type') }} </span>
        <EditAdbIOType v-model:type="info.adb_type"></EditAdbIOType>
      </GridFormLayout>
    </NCard>
    <NCard :title="t('device.connect.title')">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <template v-if="find(info.adb_serial)">
            <NButton disabled>
              {{ t('device.connect.connected') }}
            </NButton>
            <NButton @click="requestDisconnect" :loading="loading">
              {{ t('device.connect.disconnect') }}
            </NButton>
          </template>
          <NButton v-else @click="requestConnect" :loading="loading" :disabled="!maaactive">
            {{ t('device.connect.connect') }}
          </NButton>
        </div>
        <LogPanel ref="loggerEl"></LogPanel>
      </div>
    </NCard>
  </div>
  <div v-else class="flex items-center justify-center">
    <span> {{ t('device.hint.choose') }} </span>
  </div>
</template>
