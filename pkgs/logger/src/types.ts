import type { InspectOptions } from 'util'

type LowercaseAll<Keys extends string[]> = Keys extends [infer First, ...infer Rest]
  ? First extends string
    ? Rest extends string[]
      ? [Lowercase<First>, ...LowercaseAll<Rest>]
      : []
    : []
  : []

export type TLogLevel = ['SILLY', 'DEBUG', 'TRACE', 'INFO', 'WARN', 'ERROR', 'FATAL']
export type TLogLevelLowercast = LowercaseAll<TLogLevel>
export type TLogFunction = (...args: any[]) => void

export type TLogger = {
  [key in TLogLevelLowercast[number]]: TLogFunction
}

export type TLoggerEnv = {
  /**
   * name of the logger
   */
  name: string

  /**
   * source info
   */
  source: {
    file: string
    func: string
    stack: string
  }

  /**
   * time info
   */
  date: Date

  /**
   * log level
   */
  level: TLogLevel[number]

  /**
   * log content
   */
  content: {
    /**
     * formatted log
     */
    pretty: string

    /**
     * plain log
     */
    mono: string

    /**
     * object log
     */
    objs: any[]
  }
}

export type TLoggerController = {
  /**
   * log filter. only greater or equal the level would pass
   */
  level: number

  /**
   * inspect config
   */
  inspect: InspectOptions
}
