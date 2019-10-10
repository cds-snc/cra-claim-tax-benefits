var morgan = require('morgan')

morgan.token('sessionId', function getSessionId(req) {
  return req.sessionId
})

module.exports = (function morganConfig() {
  return process.env.NODE_ENV === 'production' ? jsonFormatProduction : jsonFormatDev
})()

function jsonFormatDev(tokens, req, res) {
  return JSON.stringify({
    method: tokens['method'](req, res),
    url: tokens['url'](req, res),
    status: tokens['status'](req, res),
    'response-time': tokens['response-time'](req, res) + 'ms',
  })
}

function jsonFormatProduction(tokens, req, res) {
  return JSON.stringify({
    method: tokens['method'](req, res),
    url: tokens['url'](req, res),
    status: tokens['status'](req, res),
    'response-time': tokens['response-time'](req, res) + 'ms',
    timestamp: tokens['date'](req, res, 'iso'),
    'content-length': tokens['res'](req, res, 'content-length'),
    referrer: tokens['referrer'](req, res),
    'user-agent': tokens['user-agent'](req, res),
    sessionId: tokens['sessionId'](req, res),
  })
}
