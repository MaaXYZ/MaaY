<script setup lang="ts">
import { useModule } from '@/stores/module'
import { NButton, NCard, NSelect } from 'naive-ui'
import type { Component } from 'vue'

import MaaFrameworkInfo from './MaaFramework.vue'

const { info } = useModule

const moduleInfoProvider: Record<string, Component> = {
  MaaFramework: MaaFrameworkInfo
}

function unload(m: string) {
  window.ipcRenderer.invoke('main.module.unload', m)
}

function load(m: string) {
  window.ipcRenderer.invoke('main.module.load', m)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <NCard v-for="(cfg, name) in info" :key="name" :title="name">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <NButton v-if="cfg.loaded" @click="unload(name)"> 卸载 </NButton>
          <NButton v-else @click="load(name)"> 加载 </NButton>
          <span> 版本: {{ cfg.version ?? 'N/A' }} </span>
        </div>
        <NSelect
          :value="cfg.channel"
          :options="cfg.channels.map(({ name, desc }) => ({ label: desc, value: name }))"
        ></NSelect>

        <component v-if="name in moduleInfoProvider" :is="moduleInfoProvider[name]"></component>
        <div v-else>
          {{ cfg }}
        </div>
      </div>
    </NCard>
  </div>
</template>
