<script setup lang="ts">
import { NButton, NCard } from 'naive-ui'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import ViewResource from '@/components/Respack/ViewResource.vue'
import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useInstance } from '@/stores/instance'
import { useRespack } from '@/stores/respack'

import { curInstanceHandle } from '../Instances/state'
import { curResPack } from './state'

const { info } = useRespack
const { create } = useInstance

const router = useRouter()

const rinfo = computed(() => {
  if (curResPack.value !== null) {
    return info.value[curResPack.value]
  } else {
    return null
  }
})

async function requestCreateInst() {
  if (rinfo.value) {
    const inst = await create(rinfo.value.name, rinfo.value.name)
    curInstanceHandle.value = inst.handle
    router.push('/instances')
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <template v-if="rinfo">
      <NCard title="包信息">
        <GridFormLayout>
          <span> 名称 </span>
          <span> {{ rinfo.name }} </span>
          <span> 路径 </span>
          <span> {{ rinfo.path }} </span>
          <span> 类型 </span>
          <span>
            {{ rinfo.link === 'redirect' ? '外部' : '内部' }}
            {{ rinfo.type === 'repo' ? '仓库' : '目录' }}
          </span>
        </GridFormLayout>
      </NCard>
      <NCard title="资源信息">
        <ViewResource :name="rinfo.name" :pack="rinfo.config.resource"></ViewResource>
      </NCard>
      <NCard title="使用">
        <div class="flex gap-2">
          <NButton @click="requestCreateInst"> 创建实例 </NButton>
        </div>
      </NCard>
    </template>
    <div v-else class="flex items-center justify-center">
      <span> 选择一个资源 </span>
    </div>
  </div>
</template>
