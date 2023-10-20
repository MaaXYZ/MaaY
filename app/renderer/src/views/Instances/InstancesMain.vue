<script setup lang="ts">
import { Controller, Instance, Resource } from '@maa/loader'
import { NButton, NCard, NCode, NInput, NSelect } from 'naive-ui'
import { computed, provide, ref } from 'vue'

import VariantEdit from './VariantEdit.vue'
import { selectedInstance } from './state'

import SelectController from '@/components/Controller/SelectController.vue'
import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useInstance } from '@/stores/instance'
import { useResPack } from '@/stores/respack'
import { translateCallback } from '@/utils/translog'

const { handles } = useInstance

const instInfo = computed(() => {
  return selectedInstance.value ? handles.value[selectedInstance.value] : null
})

const respackInfo = computed(() => {
  if (instInfo.value) {
    return useResPack.info.value[instInfo.value.resource.name]
  } else {
    return null
  }
})

const resourceOption = computed(() => {
  return respackInfo.value
    ? Object.entries(respackInfo.value.config.resource.resource).map(([k, v]) => ({
        label: v.name,
        value: k
      }))
    : []
})

const entryOption = computed(() => {
  return respackInfo.value
    ? respackInfo.value.config.control.entry.map((x, idx) => ({
        label: x.name,
        value: idx
      }))
    : []
})

const entryConfig = computed(() => {
  return respackInfo.value && instInfo.value!.resource.entry !== undefined
    ? respackInfo.value.config.control.entry[instInfo.value!.resource.entry!]
    : null
})

const entryCorrespondingOption = computed(() => {
  return [
    ...(respackInfo.value?.config.control.global?.option ?? []),
    ...(entryConfig.value?.option ?? [])
  ]
})

provide(
  'InstConfig',
  computed(() => instInfo.value?.resource.config)
)

const buildConfigDiff = computed(() => {
  const result: any = {}
  if (!instInfo.value || !respackInfo.value) {
    return result
  }
  for (const optkey of entryCorrespondingOption.value) {
    const opt = respackInfo.value.config.control.option[optkey]!
    const val = instInfo.value.resource.config[optkey] ?? opt.default
    if (val === undefined) {
      continue
    }
    for (const p of opt.inject ?? []) {
      const ks = p.split('.')
      let ptr: any = {
        _: result
      }
      let key = '_'
      for (const k of ks) {
        const m = /^\[(\d+)\]$/.exec(k)
        if (m) {
          if (!(key in ptr)) {
            ptr[key] = []
          }
          ptr = ptr[key]
          key = m[1]!
        } else {
          if (!(key in ptr)) {
            ptr[key] = {}
          }
          ptr = ptr[key]
          key = k
        }
      }
      ptr[key] = val
    }
    switch (opt.type) {
      case 'checkbox':
        if (val === true) {
          Object.assign(result, opt.case?.true ?? {})
        } else {
          Object.assign(result, opt.case?.false ?? {})
        }
        break
      case 'select_string':
      case 'select_number':
        for (const cs of opt.case) {
          if (cs.value === val) {
            Object.assign(result, cs.provide ?? {})
          }
        }
        break
    }
  }
  Object.assign(result, entryConfig.value?.provide ?? {})
  return result
})

const enum RunningState {
  Idle,
  Loading,
  Running
}

const running = ref<RunningState>(RunningState.Idle)
const statusMessage = ref<string[]>([])

function processCallback(msg: string, detail: string) {
  statusMessage.value.push(translateCallback(msg, detail))
}

async function run() {
  running.value = RunningState.Loading
  if (
    instInfo.value!.resource.resource === undefined ||
    instInfo.value!.resource.entry === undefined ||
    instInfo.value!.controller.handle === undefined
  ) {
    console.log('require resource & entry & controller')
    running.value = RunningState.Idle
    return false
  }
  let resPaths: string[] = []
  let res = respackInfo.value!.config.resource.resource[instInfo.value!.resource.resource!]!
  resPaths.push(res.path)
  while (res.extends) {
    res = respackInfo.value!.config.resource.resource[res.extends]!
    resPaths.push(res.path)
  }
  resPaths = await Promise.all(
    resPaths.reverse().map(p => {
      return window.ipcRenderer.invoke('main.resource.join_path', instInfo.value!.resource.name, p)
    })
  )

  instInfo.value!.extra.callback = processCallback

  const hRes = Resource.init_from(instInfo.value!.resource.handle)
  for (const p of resPaths) {
    await hRes.post_path(p).wait()
  }
  if (!(await hRes.loaded)) {
    console.log('resource not loaded')
    running.value = RunningState.Idle
    return false
  }
  const hCtrl = Controller.init_from(instInfo.value!.controller.handle)
  const app = respackInfo.value!.config.resource.app
  if (app.start) {
    await hCtrl.set_package_entry(app.start)
  }
  if (app.stop) {
    await hCtrl.set_package(app.stop)
  }
  if (app.size) {
    if (app.size.long) {
      // 0 is invalid
      await hCtrl.set_long_side(app.size.long)
    } else if (app.size.short) {
      await hCtrl.set_short_side(app.size.short)
    }
  }
  const hInst = Instance.init_from(selectedInstance.value!)
  await hInst.bind_controller(hCtrl)
  await hInst.bind_resource(hRes)
  running.value = RunningState.Running
  await hInst
    .post_task(respackInfo.value!.config.control.entry[instInfo.value!.resource.entry!]!.task, {
      diff_task: buildConfigDiff.value
    })
    .wait()
  running.value = RunningState.Idle
  return true
}

async function stop() {
  const hInst = Instance.init_from(selectedInstance.value!)
  await hInst.stop()
}
</script>

<template>
  <div v-if="selectedInstance" class="flex flex-col gap-2">
    <NCard title="信息">
      <GridFormLayout>
        <span> 名称 </span>
        <NInput v-model:value="instInfo!.name" placeholder="输入实例名称"></NInput>
      </GridFormLayout>
    </NCard>
    <NCard title="资源">
      <GridFormLayout>
        <span> 名称 </span>
        <NInput :value="instInfo!.resource.name" readonly></NInput>
        <span> 资源包 </span>
        <NSelect
          v-model:value="instInfo!.resource.resource"
          :options="resourceOption"
          placeholder="选择一个资源包"
        ></NSelect>
      </GridFormLayout>
    </NCard>
    <NCard title="设备">
      <GridFormLayout>
        <span> 设备 </span>
        <SelectController v-model:handle="instInfo!.controller.handle"></SelectController>
        <span> 句柄 </span>
        <NInput :value="instInfo!.controller.handle" readonly placeholder=""></NInput>
      </GridFormLayout>
    </NCard>
    <NCard title="配置">
      <div class="flex flex-col gap-2">
        <GridFormLayout>
          <span> 入口 </span>
          <NSelect
            v-model:value="instInfo!.resource.entry"
            :options="entryOption"
            placeholder="选择一个启动入口"
          ></NSelect>
          <template v-for="(opt, idx) of entryCorrespondingOption" :key="idx">
            <span> {{ respackInfo!.config.control.option[opt]!.name }} </span>
            <VariantEdit
              :option="respackInfo!.config.control.option[opt]!"
              :propk="opt"
            ></VariantEdit>
          </template>
        </GridFormLayout>

        <NCode language="json" :code="JSON.stringify(buildConfigDiff, null, 2)"> </NCode>
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
  <div v-else></div>
</template>
