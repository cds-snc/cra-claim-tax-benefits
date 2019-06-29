const express = require('express'),
  logger = require('../../config/winston.config'),
  path = require('path')

module.exports = function(app) {
  // redirect from "/" → "/start"
  app.get('/', (req, res, next) => res.redirect('/start'))

  app.get('/start', start)
}

function start(req, res, next) {
  try {
    logger.debug('[Start Route] get()')
    res.render('index')
  } catch (err) {
    logger.error(`[Start Route] get() ${err}`)
    res.render('error')
  }
}
