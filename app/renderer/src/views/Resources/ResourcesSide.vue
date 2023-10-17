<script setup lang="ts">
import { useResPack } from '@/stores/respack'
import { NButton } from 'naive-ui'

const { info, selected } = useResPack

function refresh() {
  window.ipcRenderer.invoke('main.resource.refresh')
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-center">
      <NButton @click="refresh">refresh</NButton>
    </div>
    <NButton v-for="(item, key) in info" :key="key" @click="selected = key">
      <div class="flex gap-2">
        <span> {{ item.name }} </span>
      </div>
    </NButton>
  </div>
</template>
