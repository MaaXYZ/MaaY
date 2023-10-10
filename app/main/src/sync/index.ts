import type { SyncVarMap_M2R, SyncVarMap_R2M, SyncVarName_M2R, SyncVarName_R2M } from '@maa/ipc'
import { watch } from '@vue-reactivity/watch'
import { ref } from '@vue/reactivity'

import { ipcMainHandle, ipcMainSend } from '../ipc'

function dup<T>(t: T): T {
  return JSON.parse(JSON.stringify(t))
}

export function registerPush<Var extends SyncVarName_M2R>(name: Var, init: SyncVarMap_M2R[Var]) {
  let value = ref(init)

  watch(
    value,
    nv => {
      console.log(nv)
      // @ts-ignore
      ipcMainSend(`main.var.${name}`, dup(nv))
    },
    {
      deep: true,
      immediate: true
    }
  )

  return value
}

export function registerRecv<Var extends SyncVarName_R2M>(name: Var, init: SyncVarMap_R2M[Var]) {
  let value = ref(init)

  // @ts-ignore
  ipcMainHandle(`main.var.${name}`, (_, nv) => {
    console.log(nv)
    // @ts-ignore
    value.value = nv
  })

  return value
}
