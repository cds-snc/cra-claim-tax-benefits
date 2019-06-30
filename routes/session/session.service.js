// import environment variables.
require('dotenv').config()

const logger = require('../../config/winston.config')

module.exports = {
  setSessionUser,
  getSessionUser,
  destroySessionUserData,
}

function setSessionUser(req, params) {
  logger.debug('[Session Service] setSessionUser()')

  if (params.firstname === undefined || params.lastname === undefined || params.email === undefined)
    throw 'validation error.'

  req.session.user = JSON.stringify({
    firstname: params.firstname,
    lastname: params.lastname,
    email: params.email,
  })

  return JSON.parse(req.session.user)
}

function getSessionUser(req) {
  logger.debug('[Session Service] getSessionUser()')
  if (req.session.user === undefined) throw 'validation error.'
  return JSON.parse(req.session.user)
}

function destroySessionUserData(req) {
  logger.debug('[Session Service] destroySessionUserData()')
  req.session.destroy(function(err) {
    if (err) throw `[Express Session] unable to destroy user session: ${err}`
  })
}
