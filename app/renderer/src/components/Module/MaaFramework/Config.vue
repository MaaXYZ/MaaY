<script setup lang="ts">
import { version } from '@maa/loader'
import { NInput, NInputNumber } from 'naive-ui'
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
  return useModule.info.value.MaaFramework
})

const cc = computed(() => {
  const cc = info.value?.config as
    | {
        host?: string
        port?: number
        path?: string
      }
    | undefined
  return {
    host: 'localhost',
    port: 8080,
    path: 'MaaRpcCli',
    ...(cc ?? {})
  }
})

const maaver = ref<string | null>(null)

watch(
  () => info.value?.loaded,
  v => {
    if (v) {
      version().then(ver => {
        maaver.value = ver
      })
    } else {
      maaver.value = null
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <GridFormLayout>
    <template v-if="info?.channel === 'external'">
      <span class="whitespace-nowrap"> MaaRpcCli路径 </span>
      <NInput
        :value="cc.path"
        @update:value="
          p =>
            emits('update:config', {
              ...cc,
              path: p
            })
        "
        :disabled="disabled"
      ></NInput>
    </template>
    <span> 服务地址 </span>
    <NInputNumber
      :min="1"
      :max="65535"
      :value="cc.port"
      @update:value="
        v =>
          emits('update:config', {
            ...cc,
            port: v
          })
      "
      :disabled="disabled"
    >
      <template #prefix> {{ cc.host }}: </template>
    </NInputNumber>
    <span> Maa版本 </span>
    <span v-if="info?.loaded"> {{ maaver }} </span>
  </GridFormLayout>
</template>
