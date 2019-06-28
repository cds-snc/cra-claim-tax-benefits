// import environment variables.
require('dotenv').config();

// import node modules.
const 
  express      = require('express'),
  cookieParser = require('cookie-parser'),
  compression  = require('compression'),
  helmet       = require('helmet')
  morgan       = require('morgan'),
  winston      = require('./config/winston.config');

// initialize application.
var app = express();

// general app configuration. 
app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.app_session_secret));

if (app.get('env') !== 'development') {
  // dnsPrefetchControl controls browser DNS prefetching
  // frameguard to prevent clickjacking
  // hidePoweredBy to remove the X-Powered-By header
  // hsts for HTTP Strict Transport Security
  // ieNoOpen sets X-Download-Options for IE8+
  // noSniff to keep clients from sniffing the MIME type
  // xssFilter adds some small XSS protections
  app.use(helmet());
  // gzip response body compression.
  app.use(compression());
}

// configure routes ... basic api strategy.
app.use('/expressbase/api/v1/', require('./routes/index/index.controller')); 

// configure routes ... basic crud api strategy w/h mongodb.
app.use('/expressbase/api/v1/employee', require('./routes/employee/employee.controller'));

// configure routes  ... basic session api strategy w/h redis.
require('../expressbase/routes/session/session.controller')(app); 

// configure routes  ... basic auth api strategy w/h auth0.
require('../expressbase/routes/auth/auth.controller')(app); 

// configure routes  ... basic ui strategy w/h pug.
require('../expressbase/routes/ui/ui.controller')(app); 

// handle global errors.
app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  winston.debug(`Service error: ${err}`);
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  res.status(err.status || 500).json({ message : "Internal service error." });
})

module.exports = app; 