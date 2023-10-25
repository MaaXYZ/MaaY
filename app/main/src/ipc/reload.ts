import { ipcMainHandle } from '.'
import { registerRecv } from '../sync'

export function setupReload() {
  const ctrls = registerRecv('controllers', {})
  ipcMainHandle('main.reload.fetch_controllers', () => {
    return JSON.parse(JSON.stringify(ctrls.value))
  })

  const insts = registerRecv('instances', {})
  ipcMainHandle('main.reload.fetch_instances', () => {
    return JSON.parse(JSON.stringify(insts.value))
  })
}
