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

// general app configuration.
app.use(morgan('combined', { stream: winston.stream }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.app_session_secret))

// view engine setup
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'pug')

/* in a real-life use case, we would precompile the CSS */
app.use(
  sassMiddleware({
    src: path.join(__dirname),
    dest: path.join(__dirname),
    debug: true,
    indentedSyntax: false,
    sourceMap: true,
  }),
)

// public assests go here (css, js, etc)
app.use(express.static(path.join(__dirname, 'public')))

if (app.get('env') !== 'development') {
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
}

// configure routes  ... basic ui strategy w/h pug.
require('./routes/ui/ui.controller')(app)

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
