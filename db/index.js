const { pool } = require('./config')
const jsonDB = require('./db.json')

const { cleanSIN } = require('../utils')

const useJson = (() => { 
  if (
    process.env.USE_DB !== 'true' ||
    process.env.NODE_ENV === 'test'
  ) {
    pool.end()
    //console.warn includes native code to colour the output— in case you're wondering
    if (process.env.NODE_ENV !== 'test') {
      console.warn('\x1b[33m%s\x1b[0m','⚠ WARNING ⚠: running off of json file instead of local database')
    }
    return true
  } 
    
  return false
})()

var DB = (() => {

  const validateCode = async (code) => {
    code = code.toUpperCase()

    if (useJson) {
      return await jsonDB.find(user => user.code === code) || null
    }

    const { rows } = await pool.query('SELECT * FROM public.access_codes WHERE code = $1', [code])
    
    return rows[0] || null
  }

  const validateUser = async ({ code, sin, dateOfBirth }) => {
    code = code.toUpperCase()
    sin = cleanSIN(sin)

    let row

    if (useJson) {
      row = jsonDB.find(user => {
        if (user.sin === sin && user.dateOfBirth === dateOfBirth) {
          return user
        }
      })
    } else {
      const { rows } = await pool.query('SELECT * FROM public.access_codes WHERE sin = $1 AND dob = $2', [sin, dateOfBirth])

      row = rows[0]
    }

    if (row && row.code !== code) {
      // code from the returned user doesn't match
      return {"error": true}
    }

    return row || null
  }

  return {
    validateCode,
    validateUser,
  }
})()

module.exports = DB
