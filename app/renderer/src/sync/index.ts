import type { SyncVarMap_M2R, SyncVarMap_R2M, SyncVarName_M2R, SyncVarName_R2M } from '@maa/ipc'
import { watch } from '@vue-reactivity/watch'
import { type ComputedRef, type Ref, type UnwrapRef, ref } from '@vue/reactivity'

function dup<T>(t: T): T {
  return JSON.parse(JSON.stringify(t))
}

function send(name: string, val: unknown) {
  // @ts-ignore
  window.ipcRenderer.invoke(`main.var.${name}`, dup(val))
}

function push(name: string, val: { value: unknown }) {
  // @ts-ignore
  window.ipcRenderer.on(`renderer.var.${name}.pull`, () => {
    send(name, val.value)
  })
}

function recv(name: string, val: { value: unknown }) {
  // @ts-ignore
  window.ipcRenderer.on(`renderer.var.${name}`, (e, v) => {
    val.value = v
  })
}

function pull(name: string) {
  // @ts-ignore
  window.ipcRenderer.invoke(`main.var.${name}.pull`)
}

type Watch<T> = Ref<T> | ComputedRef<T> | Ref<UnwrapRef<T>> | ComputedRef<UnwrapRef<T>>

export function registerSendFor<Var extends SyncVarName_M2R>(
  name: Var,
  val: Watch<SyncVarMap_M2R[Var]>
) {
  watch(
    val,
    nv => {
      send(name, nv)
    },
    {
      deep: true,
      immediate: true
    }
  )

  push(name, val)
}

export function registerSend<Var extends SyncVarName_M2R>(name: Var, init: SyncVarMap_M2R[Var]) {
  let value = ref(init)

  registerSendFor(name, value)

  return value
}

export function registerRecv<Var extends SyncVarName_R2M>(name: Var, init: SyncVarMap_R2M[Var]) {
  let value = ref(init)

  recv(name, value)

  pull(name)

  return value
}
