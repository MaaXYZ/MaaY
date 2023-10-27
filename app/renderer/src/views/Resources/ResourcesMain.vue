<script setup lang="ts">
import { Edit24Regular } from '@vicons/fluent'
import { NButton, NCard, NIcon, NInput, NModal } from 'naive-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import ViewResource from '@/components/Respack/ViewResource.vue'
import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useInstance } from '@/stores/instance'
import { useRespack } from '@/stores/respack'
import { maaactive } from '@/utils/maa'

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

const showRename = ref(false)
const renameTo = ref('')
const renameLoading = ref(false)

function openRename() {
  if (rinfo.value) {
    showRename.value = true
    renameTo.value = rinfo.value.name
  }
}

async function requestRename() {
  if (!rinfo.value) {
    return
  }
  renameLoading.value = true
  if (await window.ipcRenderer.invoke('main.resource.rename', rinfo.value.name, renameTo.value)) {
    await window.ipcRenderer.invoke('main.resource.refresh')
    showRename.value = false
    renameLoading.value = false
  }
}
</script>

<template>
  <NModal v-model:show="showRename">
    <NCard style="width: 80vw" title="重命名资源">
      <div class="flex gap-2">
        <NInput v-model:value="renameTo" placeholder="<重命名>"></NInput>
        <NButton
          @click="requestRename"
          :disabled="!renameTo || rinfo?.name === renameTo"
          :loading="renameLoading"
        >
          确认
        </NButton>
      </div>
    </NCard>
  </NModal>

  <div class="flex flex-col gap-2">
    <template v-if="rinfo">
      <NCard title="包信息">
        <GridFormLayout>
          <span> 名称 </span>
          <div class="flex gap-2 items-center">
            <span> {{ rinfo.name }} </span>
            <NButton text @click="openRename">
              <template #icon>
                <NIcon>
                  <Edit24Regular></Edit24Regular>
                </NIcon>
              </template>
            </NButton>
          </div>
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
          <NButton @click="requestCreateInst" :disabled="!maaactive"> 创建实例 </NButton>
        </div>
      </NCard>
    </template>
    <div v-else class="flex items-center justify-center">
      <span> 选择一个资源 </span>
    </div>
  </div>
</template>
