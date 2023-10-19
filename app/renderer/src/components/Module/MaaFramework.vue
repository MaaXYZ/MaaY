<script setup lang="ts">
import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useModule } from '@/stores/module'
import { version } from '@maa/loader'
import { NInput } from 'naive-ui'
import { computed, ref, watch } from 'vue'

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
  const cc = info.value?.channel_config as
    | {
        host?: string
        port?: number
        path?: string
      }
    | undefined
  return {
    host: '0.0.0.0',
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
    <span> {{ cc.host }}:{{ cc.port }} </span>
    <span> Maa版本 </span>
    <span v-if="info?.loaded"> {{ maaver }} </span>
  </GridFormLayout>
</template>
