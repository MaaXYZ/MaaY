import { formatWithOptions } from 'util'
import { format } from 'date-fns'
import chalk from 'chalk'

import type { TLogger, TLogLevel, TLoggerEnv, TLoggerController } from './types'

let pathAlias = (p: string) => p

const LogLevel: TLogLevel = ['SILLY', 'DEBUG', 'TRACE', 'INFO', 'WARN', 'ERROR', 'FATAL']

export function initLogger(prefix: string, level: 0 | 1 | 2 | 3) {
  chalk.level = level
  pathAlias = f => {
    return f.startsWith(prefix) ? f.substring(prefix.length) : f
  }
}

export function createLogger(name: string, output: (env: TLoggerEnv) => void) {
  const ctrl: TLoggerController = {
    level: 0,
    inspect: {}
  }

  function log(level: number, ...args: any[]) {
    if (level < ctrl.level) {
      return
    }

    const stack = new Error().stack?.split('\n')[3] ?? ''

    const match = /^\s*at\s+([\s\S]+?)(?:\s+\(([\s\S]+?)\))?\s*$/.exec(stack)

    const file = pathAlias(match?.[2] ?? match?.[1] ?? 'unknown')
    const func = (match?.[2] ? match?.[1] : null) ?? '<anonymous>'

    const env: TLoggerEnv = {
      name,
      source: {
        file,
        func,
        stack
      },
      date: new Date(),
      level: LogLevel[level],
      content: {
        pretty: formatWithOptions(
          {
            ...ctrl.inspect,
            colors: true
          },
          '',
          ...args
        ).slice(1),
        mono: formatWithOptions(
          {
            ...ctrl.inspect,
            colors: false
          },
          '',
          ...args
        ).slice(1)
      }
    }
    output(env)
  }

  const logger = {} as TLogger
  for (const [l, s] of LogLevel.entries()) {
    logger[s.toLowerCase() as Lowercase<typeof s>] = (...args) => {
      log(l, ...args)
    }
  }

  return [logger, ctrl] as const
}

export function createFormatter(output: (out: { pretty: string; mono: string }) => void) {
  return (env: TLoggerEnv) => {
    const time = format(env.date, 'yyyy-MM-dd HH:mm:ss:SSS')

    output({
      pretty: [
        time,
        chalk.bold(env.level),
        `[${chalk.bold(env.name)} ${env.source.file} ${env.source.func}]`,
        env.content.pretty
      ].join('\t'),
      mono: [time, env.level, `[${env.name} ${env.source.file} ${env.source.func}]`, env.content.mono].join('\t')
    })
  }
}
