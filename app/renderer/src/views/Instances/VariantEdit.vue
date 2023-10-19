<script setup lang="ts">
import type { ResourceControlOption } from '@maa/type'
import { NCheckbox, NInput, NInputNumber, NSelect } from 'naive-ui'
import { type ComputedRef, computed, inject, ref, watch } from 'vue'

const props = defineProps<{
  option: ResourceControlOption
  propk: string
}>()

const config = inject('InstConfig') as ComputedRef<any>

watch(
  () => props.option,
  () => {
    if (!(props.propk in config)) {
      config.value[props.propk] = props.option.default
    }
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<template>
  <div v-if="option.type === 'checkbox'">
    <NCheckbox v-model:checked="config[propk]" :default-checked="option.default">
      {{ option.name }}
    </NCheckbox>
  </div>
  <div v-else-if="option.type === 'select_string'">
    <div class="flex gap-2 items-center">
      <span class="whitespace-nowrap">{{ option.name }}</span>
      <NSelect
        v-model:value="config[propk]"
        :options="
          option.case.map(x => ({
            label: x.name,
            value: x.value
          }))
        "
      ></NSelect>
    </div>
  </div>
  <div v-else-if="option.type === 'select_number'">
    <div class="flex gap-2 items-center">
      <span class="whitespace-nowrap">{{ option.name }}</span>
      <NSelect
        :value="config[propk].toString()"
        @update:value="v => (config[propk] = parseInt(v))"
        :options="
          option.case.map(x => ({
            label: x.name,
            value: x.value
          }))
        "
      ></NSelect>
    </div>
  </div>
  <div v-else-if="option.type === 'input_string'">
    <div class="flex gap-2 items-center">
      <span class="whitespace-nowrap">{{ option.name }}</span>
      <NInput v-model:value="config[propk]"></NInput>
    </div>
  </div>
  <div v-else-if="option.type === 'input_number'">
    <div class="flex gap-2 items-center">
      <span class="whitespace-nowrap">{{ option.name }}</span>
      <NInputNumber v-model:value="config[propk]"></NInputNumber>
    </div>
  </div>
</template>
