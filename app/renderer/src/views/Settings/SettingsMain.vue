<script setup lang="ts">
import { registerRecv } from '@/sync'
import { onMounted } from 'vue'

const test = registerRecv('test', '333')
const deep = registerRecv('deep', { value: '' })

onMounted(() => {
  window.ipcRenderer.invoke('main.core.log', 'hello world!')
})
</script>

<template>
  <div>
    <div>{{ test }}</div>
    <div>{{ deep.value }}</div>
  </div>
</template>
