const user = require('./user.json')
const { hashString } = require('./../utils/crypto.utils')

var API = (function(userFound) {
  const _user = userFound

  const getUser = code => {
    //this because our tests run through checkPublic using API.getUser with a plain text code (A5G98S4K1)
    code = (code.length === 9) ? hashString(code.toUpperCase(), true) : code

    if (code && code === _user.login.code) {
      return _user
    }

    return null
  }

  return {
    getUser,
  }
})(user)

module.exports = API
