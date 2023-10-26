<script setup lang="ts">
import { NButton, NCard, NInput, NModal } from 'naive-ui'
import { ref } from 'vue'

import ImportResource from '@/components/Respack/ImportResource.vue'
import { useRespack } from '@/stores/respack'

import { curResPack } from './state'

const { info } = useRespack

const refreshLoading = ref(false)

async function refresh() {
  refreshLoading.value = true
  await window.ipcRenderer.invoke('main.resource.refresh')
  refreshLoading.value = false
}

const importEl = ref<InstanceType<typeof ImportResource> | null>(null)
</script>

<template>
  <ImportResource ref="importEl"></ImportResource>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2 justify-center">
      <NButton @click="refresh" :loading="refreshLoading">刷新</NButton>
      <NButton @click="importEl?.open()">导入</NButton>
    </div>
    <NButton
      v-for="(item, key) in info"
      :key="key"
      @click="curResPack = key"
      secondary
      :type="curResPack === key ? 'primary' : 'default'"
    >
      {{ item.name }}
    </NButton>
  </div>
</template>
