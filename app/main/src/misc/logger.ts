import { Logger } from '@maa/logger'
import { createWriteStream } from 'fs'
import fs from 'fs/promises'

import { inVSCode } from './debug'

Logger.init()

export let mainLogger: Logger
export let rendererLogger: Logger

export async function useLogger() {
  await fs.mkdir('debug', { recursive: true })
  const stream = createWriteStream('debug/maay.log')
  mainLogger = new Logger('main', stream, inVSCode)
  rendererLogger = new Logger('renderer', stream, inVSCode)

  mainLogger.activate()
}
