import { reactive } from '@vue/reactivity'

import { MaaFrameworkModule } from './maafw'
import { MaaYModule } from './maay'
import { Module } from './module'

export * from './persis'

export const moduleIndexs = reactive({
  MaaY: new MaaYModule(),
  MaaFramework: new MaaFrameworkModule()
})
export const modules: Module[] = reactive(Object.values(moduleIndexs))
