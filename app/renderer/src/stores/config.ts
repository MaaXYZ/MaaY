import { registerSend } from '@/sync'

const global = registerSend('global_config', {}, false)

window.ipcRenderer.invoke('main.config.fetch_global').then(obj => {
  global.value = obj
})

export const useConfig = {
  global
}
