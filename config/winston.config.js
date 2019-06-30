// import environment variables.
require('dotenv').config()

const { createLogger, transports, format } = require('winston'),
  { combine, timestamp, label, printf } = format
const appRoot = require('app-root-path')

const loggingFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

// define settings for transports.
const options = {
  error: {
    level: 'error',
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: process.env.winston_file_handleExecptions == 'true',
    json: process.env.winston_file_json == 'true',
    maxsize: parseInt(process.env.winston_file_maxsize), // 5MB
    maxFiles: parseInt(process.env.winston_file_maxFiles),
    colorize: process.env.winston_file_colorize == 'true',
  },
  info: {
    level: 'info',
    filename: `${appRoot}/logs/info.log`,
    handleExceptions: process.env.winston_file_handleExecptions == 'true',
    json: process.env.winston_file_json == 'true',
    maxsize: parseInt(process.env.winston_file_maxsize), // 5MB
    maxFiles: parseInt(process.env.winston_file_maxFiles),
    colorize: process.env.winston_file_colorize == 'true',
  },
  debug: {
    level: 'debug',
    filename: `${appRoot}/logs/debug.log`,
    handleExceptions: process.env.winston_file_handleExecptions == 'true',
    json: process.env.winston_file_json == 'true',
    maxsize: parseInt(process.env.winston_file_maxsize), // 5MB
    maxFiles: parseInt(process.env.winston_file_maxFiles),
    colorize: process.env.winston_file_colorize == 'true',
  },
  console: {
    level: process.env.winston_console_level,
    handleExceptions: process.env.winston_console_handleExceptions == 'true',
    json: process.env.winston_console_json == 'true',
    colorize: process.env.winston_console_colorize == 'true',
  },
}

let transportsArray = []

// note, you may need to create a http transport for production environments instead.
if (process.env.NODE_ENV === 'production')
  transportsArray.push(
    new transports.File(options.error),
    new transports.File(options.info),
    new transports.File(options.debug),
  )
else
  transportsArray.push(
    new transports.Console(options.console),
    new transports.File(options.error),
    new transports.File(options.info),
    new transports.File(options.debug),
  )

// instantiate a new winston logger.
let logger = new createLogger({
  transports: transportsArray,
  exitOnError: false,
  format: combine(label({ label: 'expressbase' }), timestamp(), loggingFormat),
})

// create a stream object that will be used by morgan.
logger.stream = {
  write: function(message) {
    logger.info(message)
  },
}

module.exports = logger
