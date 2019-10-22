const user = require('./user.json')

var API = (function(userFound) {
  const _user = userFound

  const getUser = code => {
    if (code === userFound.login.code) {
      return _user
    }

    return null
  }

  const getMatches = () => [_user.login.code]

  return {
    getUser,
    getMatches,
  }
})(user)

module.exports = API
