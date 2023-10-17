<script setup lang="ts">
import { useController } from '@/stores/controller'
import { useDevice } from '@/stores/device'
import { NButton, NCard } from 'naive-ui'
import { computed, ref } from 'vue'

const statusMessage = ref<string[]>([])

const { device, selected } = useDevice
const { connect, find } = useController

const info = computed(() => {
  if (selected.value !== null) {
    return device.value[selected.value]
  } else {
    return null
  }
})

async function requestConnect() {
  if (info.value) {
    const { adb_path: path, adb_serial: serial, adb_type: type, adb_config: config } = info.value
    await connect(processControllerCallback, {
      path,
      serial,
      type,
      config
    })
  }
}

function processControllerCallback(msg: string, detail: string) {
  const info = JSON.parse(detail)
  switch (msg) {
    case 'Controller.UUIDGot':
      statusMessage.value.push(`已获取UUID: ${info.uuid}`)
      break
    case 'Controller.UUIDGetFailed':
      statusMessage.value.push(`获取UUID失败`)
      break
    case 'Controller.ResolutionGot':
      statusMessage.value.push(`已获取分辨率: ${info.resolution.width}x${info.resolution.height}`)
      break
    case 'Controller.ResolutionGetFailed':
      statusMessage.value.push(`获取分辨率失败`)
      break
    case 'Controller.ScreencapInited':
      statusMessage.value.push(`已初始化截图`)
      break
    case 'Controller.ScreencapInitFailed':
      statusMessage.value.push(`初始化截图失败`)
      break
    case 'Controller.ConnectSuccess':
      statusMessage.value.push(`已连接`)
      break
    case 'Controller.ConnectFailed':
      statusMessage.value.push(`连接失败: ${info.why}`)
      break
    default:
      statusMessage.value.push(`${msg}: ${detail}`)
      break
  }
}
</script>

<template>
  <div v-if="info" class="flex flex-col gap-2">
    <NCard>
      <div class="grid" style="grid-template-columns: 1fr 6fr">
        <span> 名称 </span>
        <span>{{ info.name }}</span>
        <span> ADB路径 </span>
        <span>{{ info.adb_path }}</span>
        <span> 目标地址 </span>
        <span>{{ info.adb_serial }}</span>
      </div>
    </NCard>
    <NCard>
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <NButton v-if="find(info.adb_serial)" disabled>
            已连接 - {{ find(info.adb_serial) }}
          </NButton>
          <NButton v-else @click="requestConnect"> 连接 </NButton>
        </div>
        <div class="flex flex-col gap-2">
          <span v-for="(msg, idx) in statusMessage" :key="idx"> {{ msg }} </span>
        </div>
      </div>
    </NCard>
  </div>
  <div v-else></div>
</template>
