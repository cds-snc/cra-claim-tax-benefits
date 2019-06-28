const 
  sessionService  = require('./session.service'),
  logger          = require('../../config/winston.config'),
  session         = require('express-session'),
  redisStore      = require('connect-redis')(session),
  redis           = require('redis');

module.exports = function (app) {

  // session config.
  let sess = {
    name : process.env.app_session_name,
    secret : process.env.app_session_secret,
    resave : process.env.app_session_resave,
    rolling : process.env.app_session_rolling,
    saveUninitialized : process.env.app_session_save_uninitialized,
    cookie : {
      path : process.env.app_session_path,
    }
  }  

  if (app.get('env') !== 'development') {
    
    // create redis client.
    let redisClient = redis.createClient();

    // connection to redis server.
    redisClient.on('connect', function (err) {
      logger.info('[Redis Client] connected ...');
    });

    // error connecting to redis server.
    redisClient.on('error', function (err) {
      logger.error(`[Redis Client] ${err}`);
    });

    // trust proxy config.
    app.set('trust proxy', 1);

    // redis store config.
    sess.store = new redisStore({
      client : redisClient,
      host : process.env.redisclient_host,
      port : parseInt(process.env.redisclient_port),
      ttl : parseInt(process.env.redisclient_ttl)
    });
    
    // cookie config.
    sess.cookie.secure = (process.env.app_session_secure == 'true');
    sess.cookie.maxAge = parseInt(process.env.app_session_max_age);
    sess.cookie.httpOnly = (process.env.app_session_httpOnly == 'true');
  }

  app.use(session(sess));

  // session api routes.
  app.get('/expressbase/api/v1/session/', getSessionUser);
  app.post('/expressbase/api/v1/session/', setSessionUser)
  app.delete('/expressbase/api/v1/session/', destroySessionUserData);
};

function setSessionUser (req, res, next) {
  try {
    logger.debug('[Session Route] setSessionUser()');
    res.status(201).json(sessionService.setSessionUser(req, req.body));
  } 
  catch (err) {
    logger.error(`[Session Service] ${err}`);
    res.status(404).json({ message : "error setting user in session." });
  }
}

function getSessionUser (req, res, next) {
  try {
    logger.debug('[Session Route] getSessionUser()');
    res.status(201).json(sessionService.getSessionUser(req));
  } 
  catch (err) {
    logger.error(`[Session Service] ${err}`);
    res.status(404).json({ message : "error getting user in session." });
  }
}

function destroySessionUserData (req, res, next) {
  try {
    logger.debug('[Session Route] destroySessionUserData()');
    sessionService.destroySessionUserData(req);
    res.status(204);
  } 
  catch (err) {
    logger.error(`[Session Service] ${err}`);
    res.status(404).json({ message : "error getting user in session." });
  }
}