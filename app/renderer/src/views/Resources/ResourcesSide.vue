<script setup lang="ts">
import { NButton } from 'naive-ui'

import { useRespack } from '@/stores/respack'

import { curResPack } from './state'

const { info } = useRespack

function refresh() {
  window.ipcRenderer.invoke('main.resource.refresh')
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-center">
      <NButton @click="refresh">刷新</NButton>
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
