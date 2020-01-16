const user = require('./user.json')
const { verifyHash } = require('./../utils/crypto.utils')

var API = (function(userFound) {
  const _user = userFound

  const getUser = code => {

    code = (code.length === 9) ? code.toUpperCase() : code
    
    if (code && (code === _user.login.code || verifyHash(_user.login.code, code ,{useInitialSalt: true}))) {
      return _user
    }

    return null
  }

  return {
    getUser,
  }
})(user)

module.exports = API
