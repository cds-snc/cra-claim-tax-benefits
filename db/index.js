const db = require('./db.json')
const { cleanSIN } = require('../utils')

var DB = (() => {
  const validateCode = code => {
    code = code.toUpperCase()

    // Real DB code will go here
    return db.find(u => u.code === code) || null
  }

  const validateUser = ({ code, sin, dateOfBirth }) => {
    code = code.toUpperCase()
    sin = cleanSIN(sin)

    let row = db.find(u => {
      if (u.code === code && u.sin === sin && u.dateOfBirth === dateOfBirth) return u
    })

    return row || null
  }

  return {
    validateCode,
    validateUser,
  }
})()

module.exports = DB
