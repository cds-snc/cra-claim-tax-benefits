const express = require('express'),
  logger = require('../../config/winston.config'),
  path = require('path')

module.exports = function(app) {
  // redirect from "/" → "/start"
  app.get('/', (req, res, next) => res.redirect('/start'))
  app.get('/start', (req, res, next) => res.render('index'))
}
