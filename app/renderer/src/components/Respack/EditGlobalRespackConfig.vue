<script setup lang="ts">
import type { RespackControl } from '@maa/type'

import VariantEdit from '@/components/VariantEdit.vue'

defineProps<{
  resctrl: RespackControl
  entry: {
    config: Record<string, unknown>
  }
}>()
</script>

<template>
  <template v-for="(opt, idx) of resctrl.global?.option ?? []" :key="idx">
    <span> {{ resctrl.option[opt]!.name }} </span>
    <VariantEdit
      :option="resctrl.option[opt]!"
      v-model:target="entry.config"
      :propk="opt"
    ></VariantEdit>
  </template>
</template>
