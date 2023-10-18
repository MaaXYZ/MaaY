<script setup lang="ts">
import { useInstance } from '@/stores/instance'
import { useResPack } from '@/stores/respack'
import { NButton, NCard } from 'naive-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const { info, selected } = useResPack
const { create } = useInstance

const router = useRouter()

const rinfo = computed(() => {
  if (selected.value !== null) {
    return info.value[selected.value]
  } else {
    return null
  }
})

async function requestCreateInst() {
  if (rinfo.value) {
    const inst = await create(rinfo.value.name, rinfo.value.name)
    useInstance.selected.value = inst.handle
    router.push('/instances')
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <template v-if="rinfo">
      <NCard title="包信息">
        <div class="grid" style="grid-template-columns: 1fr 6fr">
          <span> 名称 </span>
          <span>{{ rinfo.name }}</span>
          <span> 路径 </span>
          <span>{{ rinfo.path }}</span>
        </div>
      </NCard>
      <NCard title="资源信息">
        <div class="grid" style="grid-template-columns: 1fr 6fr">
          <span> 默认启动活动 </span>
          <span>{{ rinfo.config.resource.app.start ?? '未设置' }}</span>
          <span> 默认关闭包 </span>
          <span>{{ rinfo.config.resource.app.stop ?? '未设置' }}</span>
          <span> 方向 </span>
          <span>{{ rinfo.config.resource.app.orientation === 'portait' ? '竖屏' : '横屏' }}</span>
          <span> 大小 </span>
          <span>{{
            rinfo.config.resource.app.size?.short !== undefined
              ? `短边 ${rinfo.config.resource.app.size?.short}`
              : `长边 ${rinfo.config.resource.app.size?.long ?? 1280}`
          }}</span>
          <span> 资源包 </span>
          <div class="grid" style="grid-template-columns: 1fr 5fr">
            <template v-for="(cfg, key) in rinfo.config.resource.resource" :key="key">
              <span>{{ key }}</span>
              <div class="grid" style="grid-template-columns: 1fr 4fr">
                <span>名称</span>
                <span>{{ cfg.name }}</span>
                <template v-if="cfg.description">
                  <span>详情</span>
                  <span>{{ cfg.description }}</span>
                </template>
                <span>路径</span>
                <span>{{ cfg.path }}</span>
              </div>
            </template>
          </div>
        </div>
      </NCard>
      <NCard title="使用">
        <div class="flex gap-2">
          <NButton @click="requestCreateInst"> 创建实例 </NButton>
        </div>
      </NCard>
    </template>
    <div v-else class="flex items-center justify-center">
      <span>选择一个资源</span>
    </div>
  </div>
</template>
