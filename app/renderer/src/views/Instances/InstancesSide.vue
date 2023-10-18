<script setup lang="ts">
import { useInstance } from '@/stores/instance'
import { NButton } from 'naive-ui'

const { handles, selected } = useInstance
</script>

<template>
  <div class="flex flex-col gap-2">
    <NButton v-for="(item, h) in handles" :key="h" @click="selected = h">
      <div class="flex gap-2">
        <span> {{ item.name }} </span>
      </div>
    </NButton>
  </div>
</template>
