const 
  logger = require('../../config/winston.config'),
  authService = require('./auth.service'),
  jwt = require('express-jwt'),
  jwtAuthz = require('express-jwt-authz'),
  jwksRsa = require('jwks-rsa');

module.exports = function (app) {

  // auth0 authentication middleware ... add your own here ...
  let jwtCheck = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: (process.env.auth_cache == 'true'),
      rateLimit: (process.env.auth_rateLimit == 'true'),
      jwksRequestsPerMinute: parseInt(process.env.auth_jwksRequestsPerMinute),
      jwksUri: process.env.auth_jwksUri
    }),
    audience: process.env.auth_audience,
    issuer:  process.env.auth_issuer,
    algorithms: [process.env.auth_algorithms]
  });

  // endpoint access scope
  const jwtAuthzScopes_read = 'read:messages';

  // auth api routes.
  app.get('/expressbase/api/v1/auth/messages', jwtCheck , jwtAuthz([jwtAuthzScopes_read]), getMessages);
};

function getMessages (req, res, next) {
  try {
    logger.debug('[Auth Route] getMessages()');
    res.status(200).json(authService.getMessages()); 
  } 
  catch (err) {
    logger.error(`[Auth Route] getMessages() ${err}`);
    res.status(404).json({ message : "auth error." });
  } 
}


