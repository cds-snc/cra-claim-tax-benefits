/*
  original format is an array of error objects: https://express-validator.github.io/docs/validation-result-api.html
  convert that to an object where the key is the parameter name and value is the error object
  ie,
  [
    { param: 'name', msg: 'Cannot be empty', ... },
    { param: 'number', msg: 'Cannot be empty', ... }
  ]
  to
  {
    name: { param: 'name', msg: 'Cannot be empty', ... },
    number: { param: 'number', msg: 'Cannot be empty', ... }
  }
*/
const errorArray2ErrorObject = (errors = []) => {
  return errors.array({ onlyFirstError: true }).reduce((map, obj) => {
    map[obj.param] = obj
    return map
  }, {})
}

/* Middleware */

//POST functions that handle setting the login data in the session and handle redirecting to the next page or sending an error to the client.
//Note that this is not the only error validation, see routes defined above.
const validateRedirect = (req, res, next) => {
  let redirect = req.body.redirect || null

  if (!redirect) {
    throw new Error(`[POST ${req.path}] 'redirect' parameter missing`)
  }
  return next()
}

/* Pug filters */
/**
 * Accepts a string (assumed to be a SIN)
 * If it is 9 characters long 9, this function returns a string with
 * a space inserted after the 3rd character and the 6th character
 *
 * ie, "111222333" => "111 222 333"
 *
 * @param string text a 9-character string assumed to be a social insurance number
 */
const SINFilter = text => {
  if (text.length === 9) {
    text = text.slice(0, 3) + ' ' + text.slice(3, 6) + ' ' + text.slice(6)
  }
  return text
}

/**
 * @param {Object} obj the obj we're passing, most often 'data'
 * @param {String} key the key we're trying to access, passed as a string, not including the obj ref itself
 * ex. if we're trying to get to data.personal.maritalStatus
 * pass as hasData(data, 'personal.maritalStatus')
 */
const hasData = (obj, key) => {
  return key.split('.').every(x => {
    // eslint-disable-next-line no-prototype-builtins
    if (typeof obj != 'object' || obj === null || !obj.hasOwnProperty(x) || obj[x] === null) {
      return false
    }
    obj = obj[x]
    return true
  })
}

module.exports = {
  errorArray2ErrorObject,
  validateRedirect,
  SINFilter,
  hasData,
}
