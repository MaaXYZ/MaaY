import { Frontend, definitions, setFrontend, streamAdapterFrontend } from '@maa/loader'
import { computed } from 'vue'

import { useModule } from '@/stores/module'

const { info } = useModule

export const maaactive = computed(() => {
  return info.value.MaaFramework!.loaded
})

export function setupMaa() {
  const [sendHandler, frontAdapter] = streamAdapterFrontend(async (msg, arg, id) => {
    return window.ipcRenderer.invoke('main.loader.stream', msg, arg, id)
  })
  window.ipcRenderer.on('renderer.loader.stream', (_, msg, arg, id) => {
    sendHandler(msg, arg, id)
  })
  const frontend = new Frontend(frontAdapter)
  setFrontend(frontend)
  frontend.init()
  frontend.add_all(definitions)
}
