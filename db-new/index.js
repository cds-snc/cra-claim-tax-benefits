// const { Pool } = require('pg')

// const pool = new Pool({
//   user: 'ctbadmin',
//   host: 'localhost',
//   database: 'ctb',
//   password: 'ctbpassword',
//   port: 5432,
// })

const { pool } = require('./config')

const { cleanSIN } = require('../utils')


var DBNew = (() => {

  const validateCode = async (code) => {
    code = code.toUpperCase()

    const { rows } = await pool.query('SELECT * FROM public.access_codes WHERE code = $1', [code])
    
    return rows[0] || null
  }

  const validateUser = async ({ code, sin, dateOfBirth }) => {
    code = code.toUpperCase()
    sin = cleanSIN(sin)

    const { rows } = await pool.query('SELECT * FROM public.access_codes WHERE sin = $1 AND dob = $2', [sin, dateOfBirth])

    if (rows && rows[0].code !== code) {
      return {"error": true}
    }

    return rows[0] || null
  }

  return {
    validateCode,
    validateUser,
  }
})()

module.exports = DBNew
