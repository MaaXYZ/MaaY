<script setup lang="tsx">
import { type MessageReactive, NCard, NInput, useMessage, useNotification } from 'naive-ui'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

import { useCommands } from '@/commands'

const message = useMessage()
const notification = useNotification()
useCommands.setup(message, notification)

const cmd = ref('')

let dlg: MessageReactive | null = null

const renderInput = () => {
  const inputNode = ref<InstanceType<typeof NInput> | null>(null)
  const options = computed(() => {
    return Object.keys(useCommands.handlers).filter(k => k.indexOf(cmd.value) !== -1)
  })
  nextTick(() => {
    inputNode.value?.focus()
  })
  return (
    <NCard>
      <div class="flex flex-col gap-2">
        <NInput ref={inputNode} v-model:value={cmd.value} onBlur={closeDlg} placeholder="">
          {{
            prefix: () => '>'
          }}
        </NInput>
        <div class="flex flex-col gap-1">
          {options.value.map((key, idx) => (
            <span
              class={(idx === 0 ? 'font-bold' : '') + ' cursor-pointer hover:underline'}
              onClick={useCommands.handlers[key]}
            >
              {key}
            </span>
          ))}
        </div>
      </div>
    </NCard>
  )
}

function openDlg() {
  if (!dlg) {
    dlg = message.create('', {
      render: renderInput,
      duration: 0
    })
  }
}

function closeDlg() {
  if (dlg) {
    dlg.destroy()
    dlg = null
  }
}

onMounted(() => {
  window.onkeydown = ev => {
    // ctrl+shift+P
    if (ev.ctrlKey && ev.shiftKey && ev.key === 'P') {
      openDlg()
    }
  }
})

onUnmounted(() => {
  closeDlg()
})
</script>

<template>
  <div></div>
</template>
