<script setup lang="ts">
import { Delete24Regular } from '@vicons/fluent'
import { NButton, NIcon } from 'naive-ui'

import { useInstance } from '@/stores/instance'

const { handles, selected, destroy } = useInstance
</script>

<template>
  <div class="flex flex-col gap-2">
    <template v-for="(item, h) in handles" :key="h">
      <div class="flex gap-2">
        <NButton class="flex-1" @click="selected = h"> {{ item.name }} </NButton>
        <NButton @click="destroy(h)">
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
