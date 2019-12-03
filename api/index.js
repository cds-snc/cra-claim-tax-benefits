const user = require('./user.json')

var API = (function(userFound) {
  const _user = userFound

  const getUser = code => {
    if (code && code.toUpperCase() === _user.login.code) {
      return _user
    }

    return null
  }

  return {
    getUser,
  }
})(user)

module.exports = API
