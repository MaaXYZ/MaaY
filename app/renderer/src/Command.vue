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
  const selected = ref(0)
  const fixSelected = computed<number>({
    set(v) {
      if (options.value.length === 0) {
        selected.value = 0
        return
      }
      if (v < 0) {
        selected.value = 0
      } else if (v >= options.value.length) {
        selected.value = options.value.length - 1
      } else {
        selected.value = v
      }
    },
    get() {
      return selected.value
    }
  })
  nextTick(() => {
    inputNode.value?.focus()
  })
  return (
    <NCard>
      <div class="flex flex-col gap-2">
        <NInput
          ref={inputNode}
          v-model:value={cmd.value}
          onBlur={closeDlg}
          onKeydown={e => {
            if (e.key === 'Enter') {
              if (options.value.length > 0) {
                useCommands.handlers[options.value[fixSelected.value]!]!()
              }
            } else if (e.key === 'ArrowUp') {
              fixSelected.value = fixSelected.value - 1
            } else if (e.key === 'ArrowDown') {
              fixSelected.value = fixSelected.value + 1
            }
          }}
          placeholder=""
        >
          {{
            prefix: () => '>'
          }}
        </NInput>
        <div class="flex flex-col gap-1">
          {options.value.map((key, idx) => (
            <span
              class={
                (idx === fixSelected.value ? 'font-bold' : '') + ' cursor-pointer hover:underline'
              }
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
