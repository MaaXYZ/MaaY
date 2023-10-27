import { registerSend } from '@/sync'

const global = registerSend('global_config', {}, false)

function reload_init() {
  window.ipcRenderer.invoke('main.config.fetch_global').then(obj => {
    global.value = obj
  })
}

export const useConfig = {
  reload_init,
  global
}
