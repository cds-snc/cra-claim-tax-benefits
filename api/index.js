const user = require('./user.json')
const db = require('./db.json')

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

var DB = (() => {
  const validateCode = (code) => {
    // validates access code
    code = code.toUpperCase()

    // Terrible Non-DB code 
    let user = false;
    user = db.find(function(u, i) {
      if(u.code === code)
        return true
    })

    return user
  }

  const validateUser = (login) => {
    // validates user code / sin / DoB
    login = login.toUpperCase()

    let user = false
    user = db.find(function(u,i) {
      if (u.login === login)
        return true
    })

    return false
  }

  return {
    validateCode,
    validateUser
  }
})()

module.exports = {
  API,
  DB
}
