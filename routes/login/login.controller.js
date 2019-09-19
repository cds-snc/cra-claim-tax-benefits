const { validationResult, checkSchema } = require('express-validator')
const { errorArray2ErrorObject, doRedirect, renderWithData, checkErrors, getPreviousRoute } = require('./../../utils')
const { loginSchema, sinSchema, dobSchema } = require('./../../schemas')
const API = require('../../api')
const request = require('request-promise')

module.exports = function(app) {
  // redirect from "/login" → "/login/code"
  app.get('/login', (req, res) => res.redirect('/login/code'))
  app.get('/login/code', renderWithData('login/code'))
  app.post('/login/code', checkSchema(loginSchema), postLoginCode, doRedirect)

  // SIN
  app.get('/login/sin', renderWithData('login/sin'))
  app.post('/login/sin', checkSchema(sinSchema), checkErrors('login/sin'), doRedirect)

  // Date of Birth
  app.get('/login/dateOfBirth', renderWithData('login/dateOfBirth'))
  app.post('/login/dateOfBirth', checkSchema(dobSchema), postDateOfBirth, doRedirect)
}

const postLoginCode = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // clear session
    req.session = null

    return res.status(422).render('login/code', {
      prevRoute: getPreviousRoute(req.path, req.session),
      data: { code: req.body.code },
      errors: errorArray2ErrorObject(errors),
    })
  }

  let user

  if (process.env.CTBS_SERVICE_URL && req.body.code) {
    user = await request({
      method: 'GET',
      uri: `${process.env.CTBS_SERVICE_URL}/${req.body.code}`,
      json: true,
    })
  } else {
    user = API.getUser(req.body.code || null)
  }

  if (!user) {
    throw new Error(`[POST ${req.path}] user not found for access code "${req.body.code}"`)
  }

  req.session = user // eslint-disable-line require-atomic-updates

  next()
}

const postDateOfBirth = async (req, res, next) => {
  const errors = validationResult(req)

  // copy all posted parameters, but remove the redirect
  let body = Object.assign({}, req.body)
  delete body.redirect

  if (!errors.isEmpty()) {
    let errObj = errorArray2ErrorObject(errors)

    /*
    We don't want to show the "birthdate doesn't match" error if there
    are other errors, because it is obvious the birthdate doesn't match if
    you enter a month of 99.

    If exists more than 1 error, and the match error exists, delete the match error
    */
    if (
      Object.keys(errObj).length > 1 &&
      errObj.dobDay &&
      errObj.dobDay.msg === 'errors.login.dateOfBirth.match'
    ) {
      delete errObj.dobDay
    }

    return res.status(422).render('login/dateOfBirth', {
      prevRoute: getPreviousRoute(req.path, req.session),
      data: req.session,
      body,
      errors: errObj,
    })
  }

  next()
}
