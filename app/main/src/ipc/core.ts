import { WritableComputedRef } from '@vue/reactivity'

import { registerPush } from '../sync'
import { ipcMainHandle, ipcMainSend } from './ipc'

export function setupCore() {
  const test = registerPush('test', '')
  const deep = registerPush('deep', { value: '' })
  ipcMainHandle('main.core.log', (_, str) => {
    console.log(str)

    setTimeout(() => {
      ipcMainSend('renderer.core.log', str)
      test.value = '123'
      deep.value.value = '222'
    }, 2000)
  })
}
