import { WriteStream } from 'fs'

import { createFormatter, createLogger, initLogger } from './core'
import type { TLogger, TLoggerController } from './types'

export type { TLogger }

export let logger: TLogger

export class Logger {
  logger: TLogger
  ctrl: TLoggerController

  constructor(name: string, stream: WriteStream, devtool = false) {
    const [ml, mc] = createLogger(
      name,
      devtool
        ? createFormatter(({ mono, cons }) => {
            console.log(cons[0], ...cons[1])
            stream.write(mono + '\n')
          })
        : createFormatter(({ pretty, mono }) => {
            console.log(pretty)
            stream.write(mono + '\n')
          })
    )

    this.logger = ml
    this.ctrl = mc
  }

  static init(prefix = process.cwd(), level: 0 | 1 | 2 | 3 = 3) {
    initLogger(prefix, level)
  }

  activate() {
    logger = this.logger
  }
}
