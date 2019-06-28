const 
  express      = require('express'),
  router       = express.Router(),
  logger       = require('../../config/winston.config'),
  indexService = require('./index.service');

// user api routes.
router.get('/', getIndex);
router.get('/async', getAsyncIndex);

// export employee api module.
module.exports = router;

// example controller function w/h simple try-catch impl.
function getIndex (req, res, next) {
  try {
    logger.debug('[Index Route] getIndex()');
    res.status(200).json(indexService.getIndex());
  } 
  catch (err) {
    logger.error(`[Index Service] getIndex() ... ${err}`);
    next(err);
  }
}

// example async controller function w/h simple async-await impl.
function getAsyncIndex (req, res, next) {
  logger.debug('[Index Route] getAsyncIndex()');
  indexService.getAsyncIndex()
  .then(index => index ? res.status(200).json(index) : res.status(404).json({ message : "index not found." }))
  .catch(err => {
    logger.error(`[Index Service] getAsyncIndex() ... ${err}`);
    next(err)
  });
}