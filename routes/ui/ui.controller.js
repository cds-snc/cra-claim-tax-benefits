const 
  express = require('express'),
  logger = require('../../config/winston.config'),
  path = require('path');

module.exports = function (app) {

  // view engine setup
  app.set('views', path.join(__dirname, '../../views'));
  app.set('view engine', 'pug');

  // public assests go here (css, js, etc)
  app.use('/public', express.static(path.join(__dirname, '../../public')));

  // ui routes.
  app.get('/expressbase/ui/', get);
};

function get (req, res, next) {
  try {
    logger.debug('[UI Route] get()');
    res.render('index');
  } 
  catch (err) {
    logger.error(`[UI Service] get() ${err}`);
    res.render('error');
  }
}

