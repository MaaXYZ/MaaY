<script setup lang="ts">
import { useModule } from '@/stores/module'
import { version } from '@maa/loader'
import { NInput } from 'naive-ui'
import { computed, ref, watch } from 'vue'

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
  <div class="flex flex-col gap-2">
    <div v-if="info?.channel === 'external'" class="flex gap-2 items-center">
      <span class="whitespace-nowrap"> MaaRpcCli路径: </span>
      <NInput
        :value="cc.path"
        @update:value="
          p =>
            emits('update:config', {
              ...cc,
              path: p
            })
        "
      ></NInput>
    </div>
    <span> 服务地址: {{ cc.host }}:{{ cc.port }} </span>
    <span v-if="info?.loaded"> Maa版本: {{ maaver }} </span>
  </div>
</template>
