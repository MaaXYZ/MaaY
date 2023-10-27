<script setup lang="ts">
import { Resource } from '@maa/loader'
import type { RespackResource, RespackResourceTarget } from '@maa/type'
import { NButton, NCard, NModal } from 'naive-ui'
import { ref } from 'vue'

import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useInstance } from '@/stores/instance'
import { maaactive } from '@/utils/maa'
import { translateCallback } from '@/utils/translog'

const props = defineProps<{
  name: string
  pack: RespackResource
}>()

const showTest = ref(false)
const target = ref<RespackResourceTarget | null>(null)
const resolvedPaths = ref<string[] | null>(null)

async function showTestFor(t: string, cfg: RespackResourceTarget) {
  showTest.value = true
  target.value = cfg
  resolvedPaths.value = null
  resolvedPaths.value = await useInstance.resolve_resource_paths(props.name, t, props.pack)
}

const testLoading = ref(false)
const testLoadMsg = ref<string[]>([])

async function testLoad() {
  testLoading.value = true
  testLoadMsg.value = []
  const res = await Resource.init()
  res.onCallback = (msg, detail) => {
    testLoadMsg.value.push(translateCallback(msg, detail))
  }
  for (const p of resolvedPaths.value ?? []) {
    await res.post_path(p).wait()
  }
  if (await res.loaded) {
    testLoadMsg.value.push('加载成功')
  } else {
    testLoadMsg.value.push('加载失败')
  }
  await res.destroy()
  testLoading.value = false
}
</script>

<template>
  <NModal v-model:show="showTest" :mask-closable="!testLoading">
    <NCard style="width: 80vw" v-if="target" :title="target.name">
      <GridFormLayout :right="6">
        <template v-if="target.description">
          <span> 详情 </span>
          <span> {{ target.description }} </span>
        </template>
        <span> 路径 </span>
        <span> {{ target.path }} </span>
        <template v-if="resolvedPaths">
          <span> 完整依赖 </span>
          <div class="flex flex-col gap-2">
            <span v-for="(p, i) of resolvedPaths" :key="i"> {{ p }} </span>
          </div>
          <span> 测试 </span>
          <div>
            <NButton @click="testLoad" :loading="testLoading" :disabled="!maaactive">
              加载
            </NButton>
          </div>
          <span> 日志 </span>
          <div class="flex flex-col gap-0.5">
            <span v-for="(msg, idx) of testLoadMsg" :key="idx"> {{ msg }} </span>
          </div>
        </template>
      </GridFormLayout>
    </NCard>
  </NModal>

  <GridFormLayout>
    <span> 默认启动活动 </span>
    <span> {{ pack.app.start ?? '未设置' }} </span>
    <span> 默认关闭包 </span>
    <span> {{ pack.app.stop ?? '未设置' }} </span>
    <span> 方向 </span>
    <span>
      {{ pack.app.orientation === 'portrait' ? '竖屏' : '横屏' }}
    </span>
    <span> 大小 </span>
    <span>
      {{
        pack.app.size?.short !== undefined
          ? `短边 ${pack.app.size?.short}`
          : `长边 ${pack.app.size?.long ?? 1280}`
      }}
    </span>
    <span> 资源包 </span>
    <div class="flex gap-2 flex-wrap">
      <NButton v-for="(cfg, key) in pack.resource" :key="key" @click="showTestFor(key, cfg)">
        {{ cfg.name }}
      </NButton>
    </div>
  </GridFormLayout>
</template>
