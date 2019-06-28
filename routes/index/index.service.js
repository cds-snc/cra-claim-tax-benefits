const 
  IndexModel = require('./index.model'),
  logger     = require('../../config/winston.config');

module.exports = {
  getIndex,
  getAsyncIndex
};

function getIndex () {
  logger.debug('[Index Service] getIndex()');
  let res = new IndexModel();
  res.message = 'Hello, Expressbase!';
  return res;
}

async function getAsyncIndex () {
  logger.debug('[Index Service] getIndex()');
  let res = new IndexModel();
  res.message = await getAsyncIndexHelper();
  return res;
}

function getAsyncIndexHelper () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Hello, Async Expressbase!');
    }, 2000);
  });
}