<script setup lang="ts">
import type { InstanceHandle } from '@maa/loader'
import { Add24Regular, Delete24Regular } from '@vicons/fluent'
import { NButton, NCard, NIcon } from 'naive-ui'

import { useConfig } from '@/stores/config'
import { useInstance } from '@/stores/instance'

import { curInstanceHandle, notCreatedInstances } from './state'

const { global } = useConfig
const { handles, destroy, create_with } = useInstance

function requestDestroy(h: InstanceHandle) {
  if (curInstanceHandle.value === h) {
    curInstanceHandle.value = null
  }
  destroy(h)
}

function requestDestroySave(id: string) {
  if (global.value.preset_instance && id in global.value.preset_instance) {
    delete global.value.preset_instance[id]
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <NCard title="已创建" :theme-overrides="{ color: 'transparent' }">
      <div class="flex flex-col gap-2">
        <template v-for="(item, h) in handles" :key="h">
          <div class="flex gap-2">
            <NButton
              class="flex-1"
              @click="curInstanceHandle = h"
              secondary
              :type="curInstanceHandle === h ? 'primary' : 'default'"
            >
              {{ item.name }}
            </NButton>
            <NButton @click="requestDestroy(h)">
              <template #icon>
                <NIcon>
                  <Delete24Regular></Delete24Regular>
                </NIcon>
              </template>
            </NButton>
          </div>
        </template>
      </div>
    </NCard>
    <NCard title="未创建" :theme-overrides="{ color: 'transparent' }">
      <div class="flex flex-col gap-2">
        <template v-for="(item, idx) of notCreatedInstances" :key="idx">
          <div class="flex gap-2">
            <NButton
              class="flex-1"
              @click="curInstanceHandle = item"
              secondary
              :type="curInstanceHandle === item ? 'primary' : 'default'"
            >
              {{ global.preset_instance?.[item]?.name }}
            </NButton>
            <NButton @click="requestDestroySave(item)">
              <template #icon>
                <NIcon>
                  <Delete24Regular></Delete24Regular>
                </NIcon>
              </template>
            </NButton>
          </div>
        </template>
      </div>
    </NCard>
  </div>
</template>
