import { WriteStream } from 'fs'

import type { TLogger, TLoggerController } from './types'
import { createFormatter, createLogger, initLogger } from './core'

export type { TLogger }

export let logger: TLogger

export class Logger {
  logger: TLogger
  ctrl: TLoggerController

  constructor(name: string, stream: WriteStream) {
    const [ml, mc] = createLogger(
      name,
      createFormatter(({ pretty, mono }) => {
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
