<script setup lang="ts">
import type { RespackInfo } from '@maa/type'
import { Delete24Regular } from '@vicons/fluent'
import { NButton, NCard, NIcon } from 'naive-ui'
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

const deleteLoading = ref(false)

async function requestDelete(pack: RespackInfo) {
  deleteLoading.value = true
  if (await window.ipcRenderer.invoke('main.resource.delete', pack.name)) {
    await refresh()
  }
  deleteLoading.value = false
}
</script>

<template>
  <ImportResource ref="importEl"></ImportResource>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2 justify-center">
      <NButton @click="refresh" :loading="refreshLoading"> 刷新 </NButton>
      <NButton @click="importEl?.open()"> 导入 </NButton>
    </div>
    <NCard :theme-overrides="{ color: 'transparent' }">
      <div class="flex flex-col gap-2">
        <div v-for="(item, key) in info" :key="key" class="flex gap-2">
          <NButton
            class="flex-1"
            @click="curResPack = key"
            secondary
            :type="curResPack === key ? 'primary' : 'default'"
          >
            {{ item.name }}
          </NButton>
          <NButton @click="requestDelete(item)">
            <template #icon>
              <NIcon>
                <Delete24Regular></Delete24Regular>
              </NIcon>
            </template>
          </NButton>
        </div>
      </div>
    </NCard>
  </div>
</template>
