<script setup lang="ts">
import { Database24Regular, Grid24Regular, Phone24Regular, Settings24Regular } from '@vicons/fluent'
import { NButton, NIcon } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex gap-2">
    <NButton @click="router.push('/instances')">
      <template #icon>
        <NIcon>
          <Grid24Regular></Grid24Regular>
        </NIcon>
      </template>
    </NButton>
    <NButton @click="router.push('/resources')">
      <template #icon>
        <NIcon>
          <Database24Regular></Database24Regular>
        </NIcon>
      </template>
    </NButton>
    <NButton @click="router.push('/devices')">
      <template #icon>
        <NIcon>
          <Phone24Regular></Phone24Regular>
        </NIcon>
      </template>
    </NButton>
    <NButton @click="router.push('/settings')">
      <template #icon>
        <NIcon>
          <Settings24Regular></Settings24Regular>
        </NIcon>
      </template>
    </NButton>
  </div>
</template>
