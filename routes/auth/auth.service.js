const logger = require('../../config/winston.config');

module.exports = {
  getMessages
};

function getMessages () {
  logger.debug('[Auth Service] getMessages()');
  return { 
    message : "you are authorized to get a message" 
  }
}

