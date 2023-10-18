<script setup lang="ts">
import { useController } from '@/stores/controller'
import { useInstance } from '@/stores/instance'
import { useResPack } from '@/stores/respack'
import { Controller, Instance, Resource } from '@maa/loader'
import { NButton, NCard, NInput, NSelect } from 'naive-ui'
import { computed, provide, ref } from 'vue'

import VariantEdit from './VariantEdit.vue'

const { handles, selected } = useInstance

const instInfo = computed(() => {
  return selected.value ? handles.value[selected.value] : null
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

const controllerOption = computed(() => {
  return Object.entries(useController.handles.value).map(([ctrl, cfg]) => ({
    label: cfg.serial ?? '127.0.0.1:5555',
    value: ctrl
  }))
})

const entryOption = computed(() => {
  return respackInfo.value
    ? respackInfo.value.config.control.entry.map((x, idx) => ({
        label: x.name,
        value: idx
      }))
    : []
})

const entryCorrespondingOption = computed(() => {
  return respackInfo.value && instInfo.value!.resource.entry !== undefined
    ? respackInfo.value.config.control.entry[instInfo.value!.resource.entry!]?.option ?? []
    : []
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
  return result
})

const running = ref(false)
const statusMessage = ref<string[]>([])

function processCallback(msg: string, detail: string) {
  const info = JSON.parse(detail)
  switch (msg) {
    case 'Resource.StartLoading':
      statusMessage.value.push(`开始加载 ${info.path}`)
      break
    case 'Resource.LoadingCompleted':
      statusMessage.value.push(`已加载 ${info.path}`)
      break
    case 'Resource.LoadingFailed':
      statusMessage.value.push(`加载 ${info.path} 失败`)
      break
    case 'Task.Started':
      statusMessage.value.push(`开始任务 ${info.entry}`)
      break
    case 'Task.Completed':
      statusMessage.value.push(`任务 ${info.entry} 完成`)
      break
    case 'Task.Failed':
      statusMessage.value.push(`任务 ${info.entry} 失败`)
      break
    case 'Task.Stopped':
      statusMessage.value.push(`任务 ${info.entry} 停止`)
      break
    default:
      statusMessage.value.push(`${msg}: ${detail}`)
      break
  }
}

async function run() {
  running.value = true
  if (
    instInfo.value!.resource.resource === undefined ||
    instInfo.value!.resource.entry === undefined ||
    instInfo.value!.controller.handle === undefined
  ) {
    console.log('require resource & entry & controller')
    running.value = false
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
    running.value = false
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
  const hInst = Instance.init_from(selected.value!)
  await hInst.bind_controller(hCtrl)
  await hInst.bind_resource(hRes)
  await hInst
    .post_task(respackInfo.value!.config.control.entry[instInfo.value!.resource.entry!]!.task, {
      diff_task: buildConfigDiff.value
    })
    .wait()
  running.value = false
  return true
}
</script>

<template>
  <div v-if="selected" class="flex flex-col gap-2">
    <NCard title="资源">
      <div class="grid items-center gap-2" style="grid-template-columns: 1fr 6fr">
        <span> 名称 </span>
        <NInput :value="instInfo!.resource.name" readonly></NInput>
        <span> 资源包 </span>
        <NSelect v-model:value="instInfo!.resource.resource" :options="resourceOption"></NSelect>
      </div>
    </NCard>
    <NCard title="设备">
      <div class="grid items-center gap-2" style="grid-template-columns: 1fr 6fr">
        <span> 设备 </span>
        <NSelect v-model:value="instInfo!.controller.handle" :options="controllerOption"></NSelect>
        <span> 句柄 </span>
        <NInput :value="instInfo!.controller.handle" readonly></NInput>
      </div>
    </NCard>
    <NCard title="配置">
      <div class="flex flex-col gap-2">
        <div class="grid items-center gap-2" style="grid-template-columns: 1fr 6fr">
          <span> 入口 </span>
          <NSelect v-model:value="instInfo!.resource.entry" :options="entryOption"></NSelect>
        </div>
        <VariantEdit
          v-for="(opt, idx) of entryCorrespondingOption"
          :key="idx"
          :option="respackInfo!.config.control.option[opt]!"
          :propk="opt"
        ></VariantEdit>
      </div>

      <code>
        {{ JSON.stringify(buildConfigDiff, null, 2) }}
      </code>
    </NCard>
    <NCard title="执行">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <NButton @click="run" :disabled="running"> 启动 </NButton>
        </div>
        <div class="flex flex-col gap-2">
          <span v-for="(msg, idx) in statusMessage" :key="idx"> {{ msg }} </span>
        </div>
      </div>
    </NCard>
  </div>
  <div v-else></div>
</template>
