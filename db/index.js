const db = require('./db.json')
const { cleanSIN } = require('../utils')

var DB = (() => {
  const validateCode = code => {
    code = code.toUpperCase()

    // Real DB code will go here
    return db.find(user => user.code === code) || {"error":  'errors.login.code'}
  }

  const validateUser = ({ code, sin, dateOfBirth }) => {
    code = code.toUpperCase()
    sin = cleanSIN(sin)

    let row = db.find(user => {
      if (user.sin === sin && user.dateOfBirth === dateOfBirth) {
        return user
      }
    })
    if (row && row.code !== code) {
      // code from the returned user doesn't match
      return {"error": "errors.login.codeMatch"}
    }
    return row || null
  }

  return {
    validateCode,
    validateUser,
  }
})()

module.exports = DB
