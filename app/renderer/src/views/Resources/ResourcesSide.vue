<script setup lang="ts">
import { NButton, NCard, NInput, NModal } from 'naive-ui'
import { ref } from 'vue'

import { useRespack } from '@/stores/respack'

import { curResPack } from './state'

const { info } = useRespack

const refreshLoading = ref(false)

async function refresh() {
  refreshLoading.value = true
  await window.ipcRenderer.invoke('main.resource.refresh')
  refreshLoading.value = false
}

const showImport = ref(false)
const importRepoUrl = ref('')
const importLoading = ref(false)

async function doImport() {
  importLoading.value = true
  await window.ipcRenderer.invoke('main.resource.import', importRepoUrl.value)
  importLoading.value = false
  showImport.value = false
  window.ipcRenderer.invoke('main.resource.refresh')
}
</script>

<template>
  <NModal v-model:show="showImport">
    <NCard style="width: 80vw">
      <div class="flex flex-col gap-2">
        <NInput v-model:value="importRepoUrl" placeholder="https://github.com/xxx/yyy"></NInput>
        <div class="flex gap-2">
          <NButton :disabled="!importRepoUrl" @click="doImport" :loading="importLoading">
            添加
          </NButton>
        </div>
      </div>
    </NCard>
  </NModal>

  <div class="flex flex-col gap-2">
    <div class="flex gap-2 justify-center">
      <NButton @click="refresh" :loading="refreshLoading">刷新</NButton>
      <NButton @click="showImport = true">导入</NButton>
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
