import { deinit, init } from '@maa/loader'

import { Config, Status } from './types'

export const config: Config = {
  RpcHost: '0.0.0.0:8080'
}

export const status: Status = {
  RpcActive: false
}

export async function updateRpcHost(host: string) {
  if (host === config.RpcHost) {
    return true
  }
  if (status.RpcActive) {
    await deinit()
    status.RpcActive = false
    return await connectRpc()
  }
}

export async function connectRpc() {
  if (status.RpcActive) {
    deinit()
    status.RpcActive = false
  }
  if (await init(config.RpcHost)) {
    status.RpcActive = true
    return true
  } else {
    return false
  }
}
