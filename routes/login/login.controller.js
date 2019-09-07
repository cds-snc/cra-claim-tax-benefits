const { validationResult, checkSchema } = require('express-validator')
const { errorArray2ErrorObject, doRedirect, renderWithData, checkErrors } = require('./../../utils')
const { loginSchema, sinSchema, birthSchema, authSchema } = require('./../../schemas')
const API = require('../../api')
const request = require('request-promise')

module.exports = function(app) {
  // redirect from "/login" → "/login/code"
  app.get('/login', (req, res) => res.redirect('/login/code'))
  app.get('/login/code', renderWithData('login/code', 'login code'))
  app.post('/login/code', checkSchema(loginSchema), postLoginCode, doRedirect)

  // SIN
  app.get('/login/sin', renderWithData('login/sin', 'login sin'))
  app.post('/login/sin', checkSchema(sinSchema), checkErrors('login/sin'), doRedirect)

  // Date of Birth
  app.get('/login/dateOfBirth', renderWithData('login/dateOfBirth', 'login date of birth'))
  app.post(
    '/login/dateOfBirth',
    checkSchema(birthSchema),
    checkErrors('login/dateOfBirth'),
    doRedirect,
  )

  // Auth page
  app.get('/login/auth', getAuth)
  app.post('/login/auth', checkSchema(authSchema), checkErrors('login/auth'), postAuth)
}

const postLoginCode = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // clear session
    req.session = null

    return res.status(422).render('login/code', {
      data: { code: req.body.code } || {},
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

const getAuth = (req, res) => {
  if (!req.query.redirect) {
    return res.redirect('/start')
  }

  return res.render('login/auth', { data: req.session })
}

const postAuth = (req, res) => {
  if (!req.query.redirect) {
    return res.redirect('/start')
  }

  // set "auth" to true
  req.session.login.auth = true

  let redirect = decodeURIComponent(req.query.redirect)
  if (!redirect.startsWith('/')) {
    throw new Error(`[POST ${req.path}] can only redirect to relative URLs`)
  }

  return res.redirect(redirect)
}
