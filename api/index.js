const user = require('./user.json')

var API = (function(user) {
  const _user = user

  const getUser = code => {
    if (code === user.login.code) {
      return _user
    }

    return null
  }

  return {
    getUser,
  }
})(user)

module.exports = API
