<script setup lang="ts">
import Command from '@/Command.vue'
import MainSideLayout from '@/layouts/MainSideLayout.vue'
import { NMessageProvider, NNotificationProvider } from 'naive-ui'
</script>

<template>
  <NMessageProvider>
    <NNotificationProvider>
      <Command></Command>
      <MainSideLayout class="p-2"></MainSideLayout>
    </NNotificationProvider>
  </NMessageProvider>
</template>
