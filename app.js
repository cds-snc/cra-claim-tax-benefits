require('dotenv').config()
const globalError = require('http-errors')

// import node modules.
const express = require('express'),
  azureApplicationInsights = require('applicationinsights'),
  cookieParser = require('cookie-parser'),
  trimRequest = require('trim-request'),
  compression = require('compression'),
  helmet = require('helmet'),
  morgan = require('morgan'),
  morganConfig = require('./config/morgan.config'),
  sassMiddleware = require('node-sass-middleware'),
  path = require('path'),
  sessionConfig = require('./config/session.config'),
  csp = require('./config/csp.config'),
  {
    SINFilter,
    hasData,
    checkPublic,
    sortByLineNumber,
    checkLangQuery,
    currencyFilter,
    isoDateHintText,
    currencyWithoutUnit,
    is65,
  } = require('./utils'),
  csrf = require('csurf'),
  cookieConfig = require('./config/cookie.config'),
  rateLimit = require('express-rate-limit')

// initialize application.
var app = express()

// view engine setup
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'pug')

// general app configuration.
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.app_session_secret))
app.use(require('./config/i18n.config').init)

// CSRF setup
app.use(
  csrf({
    cookie: true,
    signed: true,
    ...cookieConfig,
  }),
)

// append csrfToken to all responses
app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
})

// set up rate limiter: maximum of five requests per minute
var limiter = new rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120,
})
// apply rate limiter to expensive request page(s) - just the one for now
app.use('/login/dateOfBirth', limiter)

// in production we may want to use other than memorysession
app.use(sessionConfig)

// in production: precompile CSS
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

if (process.env.NODE_ENV === 'production' && process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  // register to Azure Application Insights service for telemetry purposes
  // instrumention key is provisioned from Azure App Service application setting (env variable)
  azureApplicationInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY).start()
}

// add a request logger
process.env.NODE_ENV !== 'test' && app.use(morgan(morganConfig))

// dnsPrefetchControl controls browser DNS prefetching
// frameguard to prevent clickjacking
// hidePoweredBy to remove the X-Powered-By header
// hsts for HTTP Strict Transport Security
// ieNoOpen sets X-Download-Options for IE8+
// noSniff to keep clients from sniffing the MIME type
// xssFilter adds some small XSS protections
app.use(helmet())
app.use(helmet.contentSecurityPolicy({ directives: csp }))

// gzip response body compression.
app.use(compression())
app.use(trimRequest.all)

app.use(checkPublic)
app.use(checkLangQuery)

// Adding values/functions to app.locals means we can access them in our templates
app.locals.GITHUB_SHA = process.env.GITHUB_SHA || null
app.locals.SINFilter = SINFilter
app.locals.currencyWithoutUnit = currencyWithoutUnit
app.locals.hasData = hasData
app.locals.currencyFilter = currencyFilter
app.locals.sortByLineNumber = sortByLineNumber
app.locals.isoDateHintText = isoDateHintText
app.locals.is65 = is65

// configure routes
require('./routes/start/start.controller')(app)
require('./routes/login/login.controller')(app)
require('./routes/personal/personal.controller')(app)
require('./routes/deductions/deductions.controller')(app)
require('./routes/vote/vote.controller')(app)
require('./routes/confirmation/confirmation.controller')(app)
require('./routes/offramp/offramp.controller')(app)
require('./routes/cancel/cancel.controller')(app)

// clear session
app.get('/clear', (req, res) => {
  req.session.destroy()
  res.redirect(302, '/')
})

app.use(function(req, res, next) {
  next(globalError(404))
})

// Pass error information to res.locals
app.use((err, req, res, next) => {
  let errObj = {}

  let status = err.status || err.statusCode || 500
  res.statusCode = status

  errObj.status = status
  if (err.message) errObj.message = err.message
  if (err.stack) errObj.stack = err.stack
  if (err.code) errObj.code = err.code
  if (err.name) errObj.name = err.name
  if (err.type) errObj.type = err.type

  res.locals.err = errObj
  next(err)
})

module.exports = app
