import { computed, reactive } from '@vue/reactivity'

import { MaaFrameworkModule } from './maafw'
import { Module } from './module'

export * from './persis'

export const moduleIndexs = reactive({
  MaaFramework: new MaaFrameworkModule()
})
export const modules: Module[] = reactive(Object.values(moduleIndexs))
