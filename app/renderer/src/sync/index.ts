import type { SyncVarMap_M2R, SyncVarMap_R2M, SyncVarName_M2R, SyncVarName_R2M } from '@maa/ipc'
import { type UnwrapRef, ref, watch } from 'vue'

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

type SimpleRef<T> = {
  value: T | UnwrapRef<T>
}

export function registerSendFor<Var extends SyncVarName_R2M>(
  name: Var,
  val: SimpleRef<SyncVarMap_R2M[Var]>,
  initPush = true
) {
  watch(
    val,
    nv => {
      send(name, nv)
    },
    {
      deep: true
    }
  )
  if (initPush) {
    push(name, val)
  }
}

export function registerSend<Var extends SyncVarName_R2M>(
  name: Var,
  init: SyncVarMap_R2M[Var],
  initPush = true
) {
  const value = ref(init)
  registerSendFor(name, value, initPush)
  return value
}

export function registerRecvFor<Var extends SyncVarName_M2R>(
  name: Var,
  val: SimpleRef<SyncVarMap_M2R[Var]>
) {
  recv(name, val)
  pull(name)
}

export function registerRecv<Var extends SyncVarName_M2R>(name: Var, init: SyncVarMap_M2R[Var]) {
  const value = ref(init)
  registerRecvFor(name, value)
  return value
}
