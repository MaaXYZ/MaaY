<script setup lang="ts">
import { Delete24Regular } from '@vicons/fluent'
import { NButton, NCard, NIcon, NInput, NSelect } from 'naive-ui'
import { computed, reactive, ref } from 'vue'

import SelectController from '@/components/Controller/SelectController.vue'
import EditGlobalRespackConfig from '@/components/Respack/EditGlobalRespackConfig.vue'
import EditRespackConfig from '@/components/Respack/EditRespackConfig.vue'
import SelectRespackResource from '@/components/Respack/SelectRespackResource.vue'
import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useConfig } from '@/stores/config'
import { RunningState, useInstance } from '@/stores/instance'
import { translateCallback } from '@/utils/translog'

import {
  curInstanceHandle,
  curInstanceInfo,
  curInstanceRespackInfo,
  curInstanceSaveInfo,
  isInstance
} from './state'

const { global } = useConfig
const { create_with, init_from, init_res_from } = useInstance

const running = ref<RunningState>(RunningState.Idle)
const statusMessage = ref<string[]>([])

const entryOption = computed(() => {
  return curInstanceRespackInfo.value
    ? curInstanceRespackInfo.value.config.control.entry.map((x, idx) => ({
        label: x.name,
        value: idx
      }))
    : []
})

function processCallback(msg: string, detail: string) {
  statusMessage.value.push(translateCallback(msg, detail))
}

async function run() {
  if (!isInstance(curInstanceHandle.value)) {
    return
  }
  ;(await init_from(curInstanceHandle.value)).onCallback = processCallback
  ;(await init_res_from(curInstanceHandle.value)).onCallback = processCallback
  await useInstance.run(
    curInstanceHandle.value,
    reactive({
      state: running,
      current: null
    })
  )
}

async function stop() {
  if (!isInstance(curInstanceHandle.value)) {
    return
  }
  await (await useInstance.init_from(curInstanceHandle.value)).stop()
}

function requestCreate(id: string) {
  const ii = global.value.preset_instance?.[id]
  if (!ii) {
    return
  }
  create_with(ii).then(inst => {
    curInstanceHandle.value = inst.handle
  })
}
</script>

<template>
  <div v-if="curInstanceSaveInfo" class="flex flex-col gap-2">
    <NCard title="信息">
      <GridFormLayout>
        <span> 名称 </span>
        <NInput v-model:value="curInstanceSaveInfo.name" placeholder="输入实例名称"></NInput>
      </GridFormLayout>
    </NCard>
    <NCard title="资源">
      <GridFormLayout>
        <span> 名称 </span>
        <NInput :value="curInstanceSaveInfo.resource.name" readonly></NInput>
        <span> 资源包 </span>
        <template v-if="curInstanceRespackInfo">
          <SelectRespackResource
            v-model:value="curInstanceSaveInfo.resource.resource"
            :pack="curInstanceRespackInfo.name"
          >
          </SelectRespackResource>
        </template>
        <template v-else>
          <span> 资源加载失败 </span>
        </template>
      </GridFormLayout>
    </NCard>
    <NCard title="设备" v-if="isInstance(curInstanceHandle)">
      <GridFormLayout>
        <span> 设备 </span>
        <SelectController v-model:handle="curInstanceInfo!.runtime.controller"></SelectController>
        <span> 句柄 </span>
        <NInput :value="curInstanceInfo!.runtime.controller" readonly placeholder=""></NInput>
      </GridFormLayout>
    </NCard>
    <NCard title="配置" v-if="curInstanceRespackInfo">
      <div class="flex flex-col gap-2">
        <NCard>
          <GridFormLayout>
            <EditGlobalRespackConfig
              :resctrl="curInstanceRespackInfo.config.control"
              :entry="curInstanceSaveInfo.resource"
            ></EditGlobalRespackConfig>
          </GridFormLayout>
        </NCard>
        <NCard v-for="(entry, idx) of curInstanceSaveInfo.resource.entries" :key="idx">
          <GridFormLayout>
            <span> 入口 </span>
            <div class="flex gap-2">
              <NSelect
                v-model:value="entry.entry"
                :options="entryOption"
                placeholder="选择一个启动入口"
              ></NSelect>
              <NButton
                @click="
                  () => {
                    curInstanceSaveInfo?.resource.entries.splice(idx, 1)
                  }
                "
                :disabled="curInstanceSaveInfo.resource.entries.length === 1"
              >
                <template #icon>
                  <NIcon>
                    <Delete24Regular></Delete24Regular>
                  </NIcon>
                </template>
              </NButton>
            </div>
            <EditRespackConfig
              :resctrl="curInstanceRespackInfo.config.control"
              :entry="entry"
            ></EditRespackConfig>
          </GridFormLayout>
        </NCard>
        <div class="flex">
          <NButton @click="curInstanceSaveInfo.resource.entries.push({ entry: 0, config: {} })">
            添加
          </NButton>
        </div>
      </div>
    </NCard>
    <NCard title="执行" v-if="isInstance(curInstanceHandle) && curInstanceRespackInfo">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <NButton
            @click="run"
            v-if="running !== RunningState.Running"
            :loading="running === RunningState.Loading"
          >
            启动
          </NButton>
          <NButton @click="stop" v-if="running === RunningState.Running"> 停止 </NButton>
        </div>
        <div class="flex flex-col gap-2">
          <span v-for="(msg, idx) in statusMessage" :key="idx"> {{ msg }} </span>
        </div>
      </div>
    </NCard>
    <NCard v-else-if="curInstanceHandle">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <NButton @click="requestCreate(curInstanceHandle)"> 创建 </NButton>
        </div>
      </div>
    </NCard>
  </div>
  <div v-else class="flex items-center justify-center">
    <span> 从资源页创建一个新实例 </span>
  </div>
</template>
