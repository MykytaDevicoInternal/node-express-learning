import { createLogger, format, transports } from 'winston'

const { combine, timestamp, colorize, printf } = format

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`
})

export const logger = createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),

  transports: [
    new transports.Console(), // ONLY PRINTING LOGS IN TERMINAL
  ],
})
