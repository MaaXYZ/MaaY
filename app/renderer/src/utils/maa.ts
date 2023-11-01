import { StreamToFlat, setContext } from '@maa/loader'
import { computed } from 'vue'

import { useModule } from '@/stores/module'

const { info } = useModule

export const maaactive = computed(() => {
  return info.value.MaaFramework!.loaded
})

export function setupMaa() {
  const [ctx, recv] = StreamToFlat((cmd, args) => {
    if (maaactive.value) {
      return window.ipcRenderer.invoke('main.loader.stream', cmd, args)
    } else {
      return Promise.resolve(null)
    }
  })
  setContext(ctx)
  window.ipcRenderer.on('renderer.loader.callback', (_, msg, id, ...args) => {
    recv(msg, id, ...args)
  })
}
