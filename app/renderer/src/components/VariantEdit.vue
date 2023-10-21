<script setup lang="ts">
import type { RespackControlOption } from '@maa/type'
import { NCheckbox, NInput, NInputNumber, NSelect } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{
  option: RespackControlOption
  target: Record<string, unknown>
  propk: string
}>()

const emits = defineEmits<{
  'update:target': [Record<string, unknown>]
}>()

const value = computed<any>({
  set(v) {
    emits('update:target', {
      ...props.target,
      [props.propk]: v
    })
  },
  get() {
    if (props.propk in props.target) {
      return props.target[props.propk]
    } else {
      return props.option.default ?? null
    }
  }
})
</script>

<template>
  <template v-if="option.type === 'checkbox'">
    <NCheckbox v-model:checked="value"></NCheckbox>
  </template>
  <template v-else-if="option.type === 'select_string'">
    <NSelect
      v-model:value="value"
      :placeholder="`选择 ${option.name}`"
      :options="
        option.case.map(c => ({
          label: c.name,
          value: c.value
        }))
      "
    ></NSelect>
  </template>
  <template v-else-if="option.type === 'select_number'">
    <NSelect
      v-model:value="value"
      :placeholder="`选择 ${option.name}`"
      :options="
        option.case.map(c => ({
          label: c.name,
          value: c.value
        }))
      "
    ></NSelect>
  </template>
  <template v-else-if="option.type === 'input_string'">
    <NInput v-model:value="value"></NInput>
  </template>
  <template v-else-if="option.type === 'input_number'">
    <NInputNumber v-model:value="value"></NInputNumber>
  </template>
</template>
