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
    let dbUser = false;
    dbUser = db.find(function(u, i) {
      if(u.code === code)
        return u
    })
    // return the whole row for now for populating session with initial data
    return dbUser
  }

  const validateUser = (login) => {
    // validates user code / sin / DoB

    let dbUser = false
    dbUser = db.find(function(u,i) {
      return (login.code.toUpperCase() === u.code) &&
        (login.sin === u.sin.replace(/\s/g, '')) &&
        (login.dateOfBirth === u.dateOfBirth)
    })

    return dbUser
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
