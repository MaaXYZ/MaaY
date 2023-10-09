import { deinit, init } from '@maa/loader'

import { config, status } from '..'

export async function rpcConnect() {
  if (status.MaaRpcActive) {
    deinit()
    status.MaaRpcActive = false
  }
  if (await init(config.MaaRpcHost)) {
    status.MaaRpcActive = true
    return true
  } else {
    return false
  }
}
