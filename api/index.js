const user = require('./user.json')

var API = (function(userFound) {
  const _user = userFound

  const getUser = code => {
    if (code && code.toUpperCase() === _user.login.code) {
      return _user
    }

    return null
  }

  const getMatches = () => [_user.login.code.toLowerCase(), _user.login.code.toUpperCase()]

  return {
    getUser,
    getMatches,
  }
})(user)

module.exports = API
