<script setup lang="ts">
import { useResPack } from '@/stores/respack'
import { NButton, NCard } from 'naive-ui'
import { computed, ref } from 'vue'

const { info, selected } = useResPack

const rinfo = computed(() => {
  if (selected.value !== null) {
    return info.value[selected.value]
  } else {
    return null
  }
})
</script>

<template>
  <div v-if="rinfo" class="flex flex-col gap-2">
    <NCard>
      <div class="grid" style="grid-template-columns: 1fr 6fr">
        <span> 名称 </span>
        <span>{{ rinfo.name }}</span>
        <span> 路径 </span>
        <span>{{ rinfo.path }}</span>
        <span> 配置 </span>
        <span>{{ rinfo.config }}</span>
      </div>
    </NCard>
  </div>
  <div v-else></div>
</template>
