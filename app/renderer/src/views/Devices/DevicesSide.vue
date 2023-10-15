<script setup lang="ts">
import LoaderInfo from '@/components/LoaderInfo.vue'
import { useDevice } from '@/stores/device'
import { NButton } from 'naive-ui'

const { device, refresh, selected } = useDevice
</script>

<template>
  <div class="flex flex-col gap-2">
    <LoaderInfo></LoaderInfo>
    <div class="flex justify-center">
      <NButton @click="refresh">refresh</NButton>
    </div>
    <NButton v-for="(item, idx) of device" :key="idx" @click="selected = idx">
      <div class="flex gap-2">
        <span> {{ item.name }} </span>

        <span> {{ item.adb_serial }} </span>
      </div>
    </NButton>
  </div>
</template>
