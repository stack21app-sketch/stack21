const levelPriority: Record<string, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
}

type LogLevel = keyof typeof levelPriority

const envLevel = (process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')) as LogLevel

function shouldLog(level: LogLevel) {
  return levelPriority[level] >= levelPriority[envLevel]
}

function formatMessage(level: LogLevel, msg: unknown, meta?: unknown) {
  const time = new Date().toISOString()
  const base = typeof msg === 'string' ? msg : JSON.stringify(msg)
  const extra = meta ? ` ${JSON.stringify(meta)}` : ''
  return `[${time}] [${level.toUpperCase()}] ${base}${extra}`
}

export const logger = {
  trace: (msg: unknown, meta?: unknown) => shouldLog('trace') && console.debug(formatMessage('trace', msg, meta)),
  debug: (msg: unknown, meta?: unknown) => shouldLog('debug') && console.debug(formatMessage('debug', msg, meta)),
  info: (msg: unknown, meta?: unknown) => shouldLog('info') && console.info(formatMessage('info', msg, meta)),
  warn: (msg: unknown, meta?: unknown) => shouldLog('warn') && console.warn(formatMessage('warn', msg, meta)),
  error: (msg: unknown, meta?: unknown) => shouldLog('error') && console.error(formatMessage('error', msg, meta)),
  fatal: (msg: unknown, meta?: unknown) => shouldLog('fatal') && console.error(formatMessage('fatal', msg, meta)),
  child: (bindings: Record<string, unknown>) => ({
    trace: (msg: unknown, meta?: unknown) => logger.trace(msg, { ...bindings, ...(meta as object) }),
    debug: (msg: unknown, meta?: unknown) => logger.debug(msg, { ...bindings, ...(meta as object) }),
    info: (msg: unknown, meta?: unknown) => logger.info(msg, { ...bindings, ...(meta as object) }),
    warn: (msg: unknown, meta?: unknown) => logger.warn(msg, { ...bindings, ...(meta as object) }),
    error: (msg: unknown, meta?: unknown) => logger.error(msg, { ...bindings, ...(meta as object) }),
    fatal: (msg: unknown, meta?: unknown) => logger.fatal(msg, { ...bindings, ...(meta as object) }),
  }),
}

export function childLogger(bindings: Record<string, unknown>) {
  return logger.child(bindings)
}

export default logger
