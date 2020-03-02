const user = require('./user.json')
const { verifyHash } = require('./../utils/crypto.utils')
const cloneDeep = require('clone-deep');

var API = (function(userFound) {
  
  const getUser = code => {
    code = (code.length === 9) ? code.toUpperCase() : code
    
    const _user = userFound.find( userFind => userFind.login.code === code.toUpperCase() || verifyHash(userFind.login.code, code ,{useInitialSalt: true}))
    
    if (_user && code && (code === _user.login.code || verifyHash(_user.login.code, code ,{useInitialSalt: true}))) {
      return cloneDeep(_user)
    }

    return null
  }

  return {
    getUser,
  }
})(user)

module.exports = API
