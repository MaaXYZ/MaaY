<script setup lang="ts">
import { Delete24Regular } from '@vicons/fluent'
import { NButton, NIcon } from 'naive-ui'
import { ref } from 'vue'

const logs = ref<string[]>([])

function add(str: string) {
  logs.value.push(str)
}

function clear() {
  logs.value = []
}

defineExpose({
  add,
  clear
})
</script>

<template>
  <div class="flex flex-col gap-1 relative">
    <div class="absolute right-0 top-0" v-if="logs.length > 0">
      <NButton @click="clear" text>
        <template #icon>
          <NIcon>
            <Delete24Regular></Delete24Regular>
          </NIcon>
        </template>
      </NButton>
    </div>
    <span v-for="(row, idx) of logs" :key="idx"> {{ row }} </span>
  </div>
</template>
