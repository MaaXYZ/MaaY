<script setup lang="ts">
import { NSelect } from 'naive-ui'
import { computed } from 'vue'

import { useTr } from '@/i18n'
import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useModule } from '@/stores/module'

defineProps<{
  disabled: boolean
}>()

const { t } = useTr()

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

const localeOptions = [
  {
    label: '简体中文',
    value: 'zh_CN'
  },
  {
    label: 'English',
    value: 'en'
  }
]
</script>

<template>
  <GridFormLayout>
    <span> {{ t('setting.maay.locale') }} </span>
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
