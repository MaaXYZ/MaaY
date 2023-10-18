<script setup lang="ts">
import { useInstance } from '@/stores/instance'
import { useResPack } from '@/stores/respack'
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
  </div>
  <div v-else></div>
</template>
