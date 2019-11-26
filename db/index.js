const db = require('./db.json')

var DB = (() => {
  const validateCode = code => {
    code = code.toUpperCase()

    // Real DB code will go here
    return db.find(u => u.code === code) || null
  }

  const validateUser = ({ code, sin, dateOfBirth }) => {
    let row = db.find(u => {
      if (
        u.code === code.toUpperCase() &&
        u.sin === sin.replace(/-|\s/g, '') &&
        u.dateOfBirth === dateOfBirth
      )
        return u
    })

    return row || null
  }

  return {
    validateCode,
    validateUser,
  }
})()

module.exports = DB
