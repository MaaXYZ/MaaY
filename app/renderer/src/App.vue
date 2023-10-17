<script setup lang="ts">
import Command from '@/Command.vue'
import MainSideLayout from '@/layouts/MainSideLayout.vue'
import { NMessageProvider, NNotificationProvider } from 'naive-ui'
</script>

<template>
  <NMessageProvider>
    <NNotificationProvider placement="bottom-right">
      <Command></Command>
      <MainSideLayout></MainSideLayout>
    </NNotificationProvider>
  </NMessageProvider>
</template>
