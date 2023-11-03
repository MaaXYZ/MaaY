<script setup lang="ts">
import type { InstanceHandle } from '@maa/loader'
import { Delete24Regular } from '@vicons/fluent'
import { NButton, NCard, NIcon } from 'naive-ui'

import { useTr } from '@/i18n'
import { useConfig } from '@/stores/config'
import { useInstance } from '@/stores/instance'

import { curInstanceHandle, curInstanceSaveInfo, notCreatedInstances } from './state'

const { t } = useTr()

const { global } = useConfig
const { handles, destroy } = useInstance

async function requestDestroy(h: InstanceHandle) {
  if (curInstanceHandle.value === h) {
    curInstanceHandle.value = curInstanceSaveInfo.value!.id
  }
  await destroy(h)
}

function requestDestroySave(id: string) {
  if (global.value.preset_instance && id in global.value.preset_instance) {
    delete global.value.preset_instance[id]
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <NCard :title="t('instance.side.instance')" :theme-overrides="{ color: 'transparent' }">
      <div class="flex flex-col gap-2">
        <div v-for="(item, h) in handles" :key="h" class="flex gap-2">
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
      </div>
    </NCard>
    <NCard :title="t('instance.side.preset')" :theme-overrides="{ color: 'transparent' }">
      <div class="flex flex-col gap-2">
        <div v-for="(item, idx) of notCreatedInstances" :key="idx" class="flex gap-2">
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
      </div>
    </NCard>
  </div>
</template>
