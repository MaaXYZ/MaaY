<script setup lang="ts">
import MainSideLayout from '@/layouts/MainSideLayout.vue'
import { onMounted } from 'vue'

onMounted(() => {
  window.ipcRenderer.invoke('main.core.log', 'hello world!')
})
</script>

<template>
  <MainSideLayout></MainSideLayout>
</template>
