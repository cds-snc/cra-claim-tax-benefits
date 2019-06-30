// import environment variables.
require('dotenv').config()

// import node modules.
const express = require('express'),
  cookieParser = require('cookie-parser'),
  compression = require('compression'),
  helmet = require('helmet'),
  morgan = require('morgan'),
  winston = require('./config/winston.config'),
  sassMiddleware = require('node-sass-middleware'),
  path = require('path')

// initialize application.
var app = express()

// view engine setup
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'pug')

// if NODE_ENV does not equal 'test', add a request logger
process.env.NODE_ENV !== 'test' && app.use(morgan('combined', { stream: winston.stream }))

// general app configuration.
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.app_session_secret))
app.use(require('./config/i18n.config').init)

// in a real-life use case, we would precompile the CSS
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    debug: false,
    indentedSyntax: false, // look for .scss files, not .sass files
    sourceMap: true,
    outputStyle: 'compressed',
  }),
)

// public assets go here (css, js, etc)
app.use(express.static(path.join(__dirname, 'public')))

// dnsPrefetchControl controls browser DNS prefetching
// frameguard to prevent clickjacking
// hidePoweredBy to remove the X-Powered-By header
// hsts for HTTP Strict Transport Security
// ieNoOpen sets X-Download-Options for IE8+
// noSniff to keep clients from sniffing the MIME type
// xssFilter adds some small XSS protections
app.use(helmet())
// gzip response body compression.
app.use(compression())

// configure routes
require('./routes/start/start.controller')(app)

// handle global errors.
app.use(function(err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  winston.debug(`Service error: ${err}`)
  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
  )

  res.status(err.status || 500).json({ message: 'Internal service error.' })
})

module.exports = app
