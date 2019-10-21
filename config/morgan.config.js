var morgan = require('morgan')

morgan.token('version', function getSha() {
  return process.env.GITHUB_SHA
})

morgan.token('responseId', function getResponseId(req) {
  return req.session ? req.session.responseId : undefined
})

morgan.token('err', function getErr(req, res) {
  return res.locals.err
})

module.exports = (function morganConfig() {
  return process.env.NODE_ENV === 'production' ? jsonFormatProduction : jsonFormatDev
})()

function jsonFormatDev(tokens, req, res) {
  return JSON.stringify({
    responseId: tokens['responseId'](req, res),
    method: tokens['method'](req, res),
    url: tokens['url'](req, res),
    status: tokens['status'](req, res),
    'response-time': tokens['response-time'](req, res) + 'ms',
  })
}

function jsonFormatProduction(tokens, req, res) {
  return JSON.stringify({
    responseId: tokens['responseId'](req, res),
    method: tokens['method'](req, res),
    url: tokens['url'](req, res),
    status: tokens['status'](req, res),
    'response-time': tokens['response-time'](req, res) + 'ms',
    timestamp: tokens['date'](req, res, 'iso'),
    'content-length': tokens['res'](req, res, 'content-length'),
    referrer: tokens['referrer'](req, res),
    'user-agent': tokens['user-agent'](req, res),
    err: tokens['err'](req, res),
    version: tokens['version'](),
  })
}
