<script setup lang="ts">
import { AdbControllerType } from '@maa/loader'
import { NSelect } from 'naive-ui'

import { useTr } from '@/i18n'
import GridFormlayout from '@/layouts/GridFormLayout.vue'

defineProps<{
  type: number
}>()

const emits = defineEmits<{
  'update:type': [number]
}>()

const { t } = useTr()

const touchOptions = [
  {
    label: 'adb',
    value: AdbControllerType.Touch_Adb
  },
  {
    label: 'minitouch',
    value: AdbControllerType.Touch_MiniTouch
  },
  {
    label: 'maatouch',
    value: AdbControllerType.Touch_MaaTouch
  }
]

const keyOptions = [
  {
    label: 'adb',
    value: AdbControllerType.Key_Adb
  },
  {
    label: 'maatouch',
    value: AdbControllerType.Key_MaaTouch
  }
]

const screencapOptions = [
  {
    label: t('device.type.fastest_way'),
    value: AdbControllerType.Screencap_FastestWay
  },
  {
    label: t('device.type.raw_by_netcat'),
    value: AdbControllerType.Screencap_RawByNetcat
  },
  {
    label: t('device.type.raw_with_gzip'),
    value: AdbControllerType.Screencap_RawWithGzip
  },
  {
    label: t('device.type.encode'),
    value: AdbControllerType.Screencap_Encode
  },
  {
    label: t('device.type.encode_to_file'),
    value: AdbControllerType.Screencap_EncodeToFile
  },
  {
    label: t('device.type.minicap_direct'),
    value: AdbControllerType.Screencap_MinicapDirect
  },
  {
    label: t('device.type.minicap_stream'),
    value: AdbControllerType.Screencap_MinicapStream
  }
]
</script>

<template>
  <GridFormlayout>
    <span> {{ t('device.info.touch') }} </span>
    <NSelect
      :value="type & AdbControllerType.Touch_Mask"
      @update:value="
        v => {
          emits('update:type', (type & ~AdbControllerType.Touch_Mask) | v)
        }
      "
      :options="touchOptions"
    ></NSelect>

    <span> {{ t('device.info.key') }} </span>
    <NSelect
      :value="type & AdbControllerType.Key_Mask"
      @update:value="
        v => {
          emits('update:type', (type & ~AdbControllerType.Key_Mask) | v)
        }
      "
      :options="keyOptions"
    ></NSelect>

    <span> {{ t('device.info.screencap') }} </span>
    <NSelect
      :value="type & AdbControllerType.Screencap_Mask"
      @update:value="
        v => {
          emits('update:type', (type & ~AdbControllerType.Screencap_Mask) | v)
        }
      "
      :options="screencapOptions"
    ></NSelect>
  </GridFormlayout>
</template>
