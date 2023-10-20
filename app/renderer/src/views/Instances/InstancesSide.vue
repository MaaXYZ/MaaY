<script setup lang="ts">
import type { InstanceHandle } from '@maa/loader'
import { Delete24Regular } from '@vicons/fluent'
import { NButton, NIcon } from 'naive-ui'

import { curInstanceHandle } from './state'

import { useInstance } from '@/stores/instance'

const { handles, destroy } = useInstance

function requestDestroy(h: InstanceHandle) {
  if (curInstanceHandle.value === h) {
    curInstanceHandle.value = null
  }
  destroy(h)
}
</script>

<template>
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
</template>
