<script setup lang="ts">
import { NButton, NCard, NSelect } from 'naive-ui'
import { type Component, ref } from 'vue'

import MaaFrameworkInfo from './MaaFramework.vue'

import { useModule } from '@/stores/module'

const { info } = useModule

const moduleInfoProvider: Record<string, Component> = {
  MaaFramework: MaaFrameworkInfo
}

const loading = ref(false)

async function unload(m: string) {
  loading.value = true
  await window.ipcRenderer.invoke('main.module.unload', m)
  loading.value = false
}

async function load(m: string) {
  loading.value = true
  await window.ipcRenderer.invoke('main.module.load', m)
  loading.value = false
}

function setChannel(m: string, c: string) {
  window.ipcRenderer.invoke('main.module.set_channel', m, c)
}

function setConfig(m: string, c: unknown) {
  window.ipcRenderer.invoke('main.module.set_config', m, c)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <NCard v-for="(cfg, name) in info" :key="name" :title="name">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          <NButton v-if="cfg.loaded" @click="unload(name)" :disabled="loading"> 卸载 </NButton>
          <NButton v-else @click="load(name)" :disabled="loading"> 加载 </NButton>
          <span> 版本: {{ cfg.version ?? 'N/A' }} </span>
        </div>
        <NSelect
          :value="cfg.channel"
          @update:value="v => setChannel(name, v)"
          :disabled="cfg.loaded"
          :options="cfg.channels.map(({ name, desc }) => ({ label: desc, value: name }))"
        ></NSelect>

        <component
          v-if="name in moduleInfoProvider"
          :is="moduleInfoProvider[name]"
          @update:config="(c: unknown) => setConfig(name, c)"
          :disabled="cfg.loaded"
        ></component>
        <div v-else>
          {{ cfg }}
        </div>
      </div>
    </NCard>
  </div>
</template>
