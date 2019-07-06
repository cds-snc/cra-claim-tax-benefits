const user = require('./user.json')

var API = (function(user) {
  const _user = user

  const getUser = code => {
    if (code === user.login.code) {
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
