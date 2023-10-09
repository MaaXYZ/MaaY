import { deinit } from '@maa/loader'
import { watch } from '@vue-reactivity/watch'
import { effect, reactive } from '@vue/reactivity'

import { rpcConnect } from './loader'
import { Config, Status } from './types'

export const config = reactive<Config>({
  MaaRpcHost: '0.0.0.0:8080'
})

export const status = reactive<Status>({
  MaaRpcActive: false
})

watch(
  () => config.MaaRpcHost,
  () => {
    if (status.MaaRpcActive) {
      deinit()
      status.MaaRpcActive = false
      rpcConnect()
    }
  }
)
