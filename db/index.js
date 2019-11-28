const db = require('./db.json')
const { cleanSIN } = require('../utils')

var DB = (() => {
  const validateCode = code => {
    code = code.toUpperCase()

    // Real DB code will go here
    return db.find(user => user.code === code) || null
  }

  const validateUser = ({ code, sin, dateOfBirth }) => {
    code = code.toUpperCase()
    sin = cleanSIN(sin)

    let row = db.find(user => {
      if (user.code === code && user.sin === sin && user.dateOfBirth === dateOfBirth) return user
    })

    return row || null
  }

  return {
    validateCode,
    validateUser,
  }
})()

module.exports = DB
