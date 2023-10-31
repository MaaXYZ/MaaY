<script setup lang="ts">
import { version } from '@maa/loader'
import { NInput, NInputNumber, NSelect, NSwitch } from 'naive-ui'
import { computed, ref, watch } from 'vue'

import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useModule } from '@/stores/module'

defineProps<{
  disabled: boolean
}>()

const emits = defineEmits<{
  'update:config': [unknown]
}>()

const info = computed(() => {
  return useModule.info.value.MaaY
})

const cc = computed(() => {
  const cc = info.value?.config as
    | {
        locale?: 'zh_CN' | 'en'
      }
    | undefined
  return {
    locale: 'zh_CN',
    ...(cc ?? {})
  }
})

const localeOptions = ['zh_CN', 'en'].map(x => ({
  label: x,
  value: x
}))
</script>

<template>
  <GridFormLayout>
    <span> 语言 </span>
    <NSelect
      :options="localeOptions"
      :value="cc.locale"
      @update:value="
        v =>
          emits('update:config', {
            ...cc,
            locale: v
          })
      "
    ></NSelect>
  </GridFormLayout>
</template>
