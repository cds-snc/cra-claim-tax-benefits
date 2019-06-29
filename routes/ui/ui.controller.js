const express = require('express'),
  logger = require('../../config/winston.config'),
  path = require('path')

module.exports = function(app) {
  // ui routes.
  app.get('/expressbase/ui/', get)
}

function get(req, res, next) {
  try {
    logger.debug('[UI Route] get()')
    res.render('index')
  } catch (err) {
    logger.error(`[UI Service] get() ${err}`)
    res.render('error')
  }
}
