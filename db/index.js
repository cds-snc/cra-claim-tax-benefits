const { pool } = require('./config')
const jsonDB = require('./db.json')

const { verifyHash, hashString } = require('../utils/crypto.utils')

const useJson = (() => {
  if (process.env.USE_DB !== 'true' || process.env.NODE_ENV === 'test') {
    pool.end()
    //console.warn includes native code to colour the output— in case you're wondering
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.warn(
        '\x1b[33m%s\x1b[0m',
        '⚠ WARNING ⚠: running off of json file instead of local database',
      )
    }

    return true
  }

  return false
})()

var DB = (() => {
  const _formatRow = row => {
    if (!row) {
      return row
    }

    // remap first_name to firstName and date_of_birth to dateOfBirth
    const { first_name: firstName, date_of_birth: dateOfBirth, ...props } = row

    return {
      ...props,
      firstName,
      dateOfBirth,
    }
  }

  const validateCode = async code => {
    if (useJson) {
      const row =
        (await jsonDB.find(user =>
          verifyHash(code.toUpperCase(), user.code, { useInitialSalt: true }),
        )) || null

      return _formatRow(row)
    }

    code = hashString(code, { useInitialSalt: true })

    const { rows } = await pool.query('SELECT * FROM public.access_codes WHERE code = $1', [code])

    return _formatRow(rows[0]) || null
  }

  const validateUser = async ({ code, dateOfBirth }) => {
    let row

    if (useJson) {
      code = code.length === 9 ? hashString(code.toUpperCase(), { useInitialSalt: true }) : code

      row = jsonDB.find(user => user.code === code)
    } else {
      //find by access code, and then check dob
      //this is to save us from needing to go through each entry and verify each hash. Pull by the code we already have, and then check the dob hash
      //it saves having to use a static salt everywhere (slight security risk), and lets us use a randomly generated salt
      const { rows } = await pool.query('SELECT * FROM public.access_codes WHERE code = $1', [code])

      row = rows[0]
    }

    if (!row) {
      return { error: true }
    }

    const incorrectInfo = []
    dateOfBirth != row.date_of_birth && incorrectInfo.push(false)

    if (incorrectInfo.length > 1) {
      return { error: true }
    } else if (incorrectInfo.length) {
      return null
    }

    return _formatRow(row)
  }

  return {
    validateCode,
    validateUser,
  }
})()

module.exports = DB
