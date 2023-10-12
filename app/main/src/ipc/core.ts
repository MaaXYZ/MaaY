import { WritableComputedRef } from '@vue/reactivity'

import { registerSend } from '../sync'
import { ipcMainHandle, ipcMainSend } from './ipc'

export function setupCore() {
  const test = registerSend('test', 'aaa')
  const deep = registerSend('deep', { value: 'bbb' })
  ipcMainHandle('main.core.log', (_, str) => {
    console.log(str)

    setTimeout(() => {
      ipcMainSend('renderer.core.log', str)
      test.value = '123'
      deep.value.value = '222'
    }, 2000)
  })
}
