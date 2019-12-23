const { pool } = require('./config')
const jsonDB = require('./db.json')

const { cleanSIN } = require('../utils')

const useJson = new Promise((resolve, reject) => { 
  pool.query('SELECT NOW()', (err, res) => {
    if (
      (process.env.NODE_ENV !== 'production' && 
      (err && err.errno === -61) && 
      !res) ||
      process.env.NODE_ENV === 'test'
    ) {
      pool.end()
      console.warn('running off of json file instead of local database')
      resolve(true)
    } 
     
    resolve(false)

  })
})

var DB = (() => {

  const validateCode = async (code) => {
    code = code.toUpperCase()

    if (await useJson) {
      return await jsonDB.find(user => user.code === code) || null
    }

    const { rows } = await pool.query('SELECT * FROM public.access_codes WHERE code = $1', [code])
    
    return rows[0] || null
  }

  const validateUser = async ({ code, sin, dateOfBirth }) => {
    code = code.toUpperCase()
    sin = cleanSIN(sin)

    let row

    if (await useJson) {
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
