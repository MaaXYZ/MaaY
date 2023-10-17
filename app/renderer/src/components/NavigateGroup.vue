<script setup lang="ts">
import { PhoneAndroidOutlined, SettingsOutlined } from '@vicons/material'
import { NButton, NIcon } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex gap-2">
    <NButton text @click="router.push('/devices')">
      <template #icon>
        <NIcon>
          <PhoneAndroidOutlined></PhoneAndroidOutlined>
        </NIcon>
      </template>
    </NButton>
    <NButton text @click="router.push('/settings')">
      <template #icon>
        <NIcon>
          <SettingsOutlined></SettingsOutlined>
        </NIcon>
      </template>
    </NButton>
  </div>
</template>
