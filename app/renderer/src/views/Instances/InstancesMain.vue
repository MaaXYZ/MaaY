<script setup lang="ts">
import { Delete24Regular } from '@vicons/fluent'
import { NButton, NCard, NIcon, NInput, NSelect } from 'naive-ui'
import { computed, reactive, ref } from 'vue'

import SelectController from '@/components/Controller/SelectController.vue'
import EditGlobalRespackConfig from '@/components/Respack/EditGlobalRespackConfig.vue'
import EditRespackConfig from '@/components/Respack/EditRespackConfig.vue'
import SelectRespackResource from '@/components/Respack/SelectRespackResource.vue'
import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { RunningState, useInstance } from '@/stores/instance'
import { translateCallback } from '@/utils/translog'

import { curInstanceHandle, curInstanceInfo, curInstanceRespackInfo } from './state'

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
  if (!curInstanceHandle.value) {
    return
  }
  ;(await useInstance.init_from(curInstanceHandle.value)).onCallback = processCallback
  ;(await useInstance.init_res_from(curInstanceHandle.value)).onCallback = processCallback
  await useInstance.run(
    curInstanceHandle.value,
    reactive({
      state: running,
      current: null
    })
  )
}

async function stop() {
  if (curInstanceHandle.value) {
    await (await useInstance.init_from(curInstanceHandle.value)).stop()
  }
}
</script>

<template>
  <div v-if="curInstanceInfo" class="flex flex-col gap-2">
    <NCard title="信息">
      <GridFormLayout>
        <span> 名称 </span>
        <NInput v-model:value="curInstanceInfo!.name" placeholder="输入实例名称"></NInput>
      </GridFormLayout>
    </NCard>
    <NCard title="资源">
      <GridFormLayout>
        <span> 名称 </span>
        <NInput :value="curInstanceInfo!.resource.name" readonly></NInput>
        <span> 资源包 </span>
        <SelectRespackResource
          v-model:value="curInstanceInfo!.resource.resource"
          :pack="curInstanceRespackInfo?.name"
        ></SelectRespackResource>
      </GridFormLayout>
    </NCard>
    <NCard title="设备">
      <GridFormLayout>
        <span> 设备 </span>
        <SelectController v-model:handle="curInstanceInfo!.controller"></SelectController>
        <span> 句柄 </span>
        <NInput :value="curInstanceInfo!.controller" readonly placeholder=""></NInput>
      </GridFormLayout>
    </NCard>
    <NCard title="配置">
      <div class="flex flex-col gap-2">
        <NCard>
          <GridFormLayout>
            <EditGlobalRespackConfig
              :resctrl="curInstanceRespackInfo!.config.control"
              :entry="curInstanceInfo!.resource"
            ></EditGlobalRespackConfig>
          </GridFormLayout>
        </NCard>
        <NCard v-for="(entry, idx) of curInstanceInfo!.resource.entries" :key="idx">
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
                    curInstanceInfo!.resource.entries.splice(idx, 1)
                  }
                "
                :disabled="curInstanceInfo!.resource.entries.length === 1"
              >
                <template #icon>
                  <NIcon>
                    <Delete24Regular></Delete24Regular>
                  </NIcon>
                </template>
              </NButton>
            </div>
            <EditRespackConfig
              :resctrl="curInstanceRespackInfo!.config.control"
              :entry="entry"
            ></EditRespackConfig>
          </GridFormLayout>
        </NCard>
        <div class="flex">
          <NButton @click="curInstanceInfo!.resource.entries.push({ entry: 0, config: {} })">
            添加
          </NButton>
        </div>
      </div>
    </NCard>
    <NCard title="执行">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <NButton
            @click="run"
            v-if="running !== RunningState.Running"
            :disabled="running === RunningState.Loading"
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
  </div>
  <div v-else class="flex items-center justify-center">
    <span>从资源页创建一个新实例</span>
  </div>
</template>
