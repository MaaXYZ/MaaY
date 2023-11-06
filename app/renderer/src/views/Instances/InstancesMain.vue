<script setup lang="ts">
import { Delete24Regular } from '@vicons/fluent'
import { NButton, NCard, NIcon, NInput, NSelect } from 'naive-ui'
import { computed, reactive, ref } from 'vue'

import SelectController from '@/components/Controller/SelectController.vue'
import LogPanel from '@/components/LogPanel.vue'
import EditGlobalRespackConfig from '@/components/Respack/EditGlobalRespackConfig.vue'
import EditRespackConfig from '@/components/Respack/EditRespackConfig.vue'
import SelectRespackResource from '@/components/Respack/SelectRespackResource.vue'
import { useTr } from '@/i18n'
import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useConfig } from '@/stores/config'
import { RunningState, useInstance } from '@/stores/instance'
import { maaactive } from '@/utils/maa'
import { translateCallback } from '@/utils/translog'

import {
  curInstanceHandle,
  curInstanceInfo,
  curInstanceRespackInfo,
  curInstanceSaveInfo,
  isInstance
} from './state'

const { t } = useTr()

const { global } = useConfig
const { create_with, init_from, init_res_from } = useInstance

const running = ref<RunningState>(RunningState.Idle)

const loggerEl = ref<InstanceType<typeof LogPanel> | null>(null)

const entryOption = computed(() => {
  return curInstanceRespackInfo.value
    ? curInstanceRespackInfo.value.config.control.entry.map((x, idx) => ({
        label: x.name,
        value: idx
      }))
    : []
})

async function processCallback(msg: string, detail: string) {
  loggerEl.value?.add(translateCallback(msg, detail))
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
      current: null,
      log: (x: string) => {
        loggerEl.value?.add(x)
      }
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
    <NCard :title="t('instance.info.title')">
      <GridFormLayout>
        <span> {{ t('global.name') }} </span>
        <NInput v-model:value="curInstanceSaveInfo.name" placeholder="输入实例名称"></NInput>
      </GridFormLayout>
    </NCard>
    <NCard :title="t('instance.respack.title')">
      <GridFormLayout>
        <span> {{ t('global.name') }} </span>
        <NInput :value="curInstanceSaveInfo.resource.name" readonly></NInput>
        <span> {{ t('global.respack') }} </span>
        <template v-if="curInstanceRespackInfo">
          <SelectRespackResource
            v-model:value="curInstanceSaveInfo.resource.target"
            :pack="curInstanceRespackInfo.name"
          >
          </SelectRespackResource>
        </template>
        <template v-else>
          <span> {{ t('instance.hint.resource_load_failed') }} </span>
        </template>
      </GridFormLayout>
    </NCard>
    <NCard :title="t('instance.device.title')" v-if="isInstance(curInstanceHandle)">
      <GridFormLayout>
        <span> {{ t('global.device') }} </span>
        <SelectController v-model:handle="curInstanceInfo!.runtime.controller"></SelectController>
        <template v-if="global.debug_mode">
          <span> 句柄 </span>
          <NInput :value="curInstanceInfo!.runtime.controller" readonly placeholder=""></NInput>
        </template>
      </GridFormLayout>
    </NCard>
    <NCard :title="t('instance.task.title')" v-if="curInstanceRespackInfo">
      <div class="flex flex-col gap-2">
        <NCard :title="t('instance.task.global_config')">
          <GridFormLayout>
            <EditGlobalRespackConfig
              :resctrl="curInstanceRespackInfo.config.control"
              :entry="curInstanceSaveInfo.resource"
            ></EditGlobalRespackConfig>
          </GridFormLayout>
        </NCard>
        <NCard
          v-for="(entry, idx) of curInstanceSaveInfo.resource.entries"
          :key="idx"
          :title="t('instance.task.task')"
        >
          <GridFormLayout>
            <span> {{ t('instance.run.entry') }} </span>
            <div class="flex gap-2">
              <NSelect
                v-model:value="entry.entry"
                :options="entryOption"
                :placeholder="t('instance.task.hint.entry')"
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
            {{ t('global.add') }}
          </NButton>
        </div>
      </div>
    </NCard>
    <NCard
      :title="t('instance.run.title')"
      v-if="isInstance(curInstanceHandle) && curInstanceRespackInfo"
    >
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <NButton
            @click="run"
            v-if="running !== RunningState.Running"
            :loading="running === RunningState.Loading"
          >
            {{ t('global.start') }}
          </NButton>
          <NButton @click="stop" v-if="running === RunningState.Running">
            {{ t('global.stop') }}
          </NButton>
        </div>
        <LogPanel ref="loggerEl"></LogPanel>
      </div>
    </NCard>
    <NCard v-else-if="curInstanceHandle">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <NButton @click="requestCreate(curInstanceHandle)" :disabled="!maaactive">
            {{ t('global.create') }}
          </NButton>
        </div>
      </div>
    </NCard>
  </div>
  <div v-else class="flex items-center justify-center">
    <span> {{ t('instance.hint.choose') }} </span>
  </div>
</template>
