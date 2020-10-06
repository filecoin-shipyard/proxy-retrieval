import * as util from 'util'
import * as winston from 'winston'

const size10MB = 10 * 1024 * 1024

const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`
})

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: size10MB }),
    new winston.transports.File({ filename: 'logs/logs.log', maxsize: size10MB }),

    new winston.transports.Console(),
  ],
})

const argsToString = (args) => {
  return args.map((arg) => {
    if (typeof arg === 'object') {
      return util.inspect(arg)
    }

    return arg
  })
}

export const logger = {
  log(...args) {
    const params = argsToString(args)

    winstonLogger.info(params.join(' '))
  },

  error(...args) {
    const params = argsToString(args)

    winstonLogger.error(params.join(' '))
  },
}
