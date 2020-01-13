const { validationResult, checkSchema } = require('express-validator')
const {
  errorArray2ErrorObject,
  doRedirect,
  renderWithData,
  checkErrors,
  getPreviousRoute,
} = require('./../../utils')
const {
  loginSchema,
  _toISOFormat,
  sinSchema,
  dobSchema,
} = require('./../../schemas')
const API = require('../../api')
const DB = require('../../db')

module.exports = function(app) {
  // redirect from "/login" → "/login/code"
  app.get('/login', (req, res) => res.redirect('/login/code'))
  app.get('/login/code', renderWithData('login/code', { errorsKey: 'login' }))
  app.post('/login/code', checkSchema(loginSchema), postLoginCode, doRedirect)

  // SIN
  app.get('/login/sin', renderWithData('login/sin', { errorsKey: 'login' }))
  app.post('/login/sin', checkSchema(sinSchema), checkErrors('login/sin'), postSIN, doRedirect)

  // Date of Birth
  app.get('/login/dateOfBirth', renderWithData('login/dateOfBirth'))
  app.post(
    '/login/dateOfBirth',
    checkSchema(dobSchema),
    checkErrors('login/dateOfBirth'),
    postLogin,
    doRedirect,
  )

  app.get('/login/error/doesNotMatch', renderWithData('login/error/doesNotMatch'))
}

const postLoginCode = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // clear session
    req.session.destroy()
    return res.status(422).render('login/code', {
      prevRoute: getPreviousRoute(req),
      data: { code: req.body.code },
      errors: errorArray2ErrorObject(errors),
    })
  }

  // check if code is valid
  const row = await DB.validateCode(req.body.code)

  if (!row) {
    // code is not valid
    return res.status(422).render('login/code', {
      prevRoute: getPreviousRoute(req),
      data: { code: req.body.code },
      errors: {
        code: {
          param: 'code',
          msg: 'errors.login.code',
        },
      },
    })
  }

  // populate the session.login with our submitted access code
  // eslint-disable-next-line
  req.session.login = { code: row.code, firstName: row.firstName }

  next()
}

const postSIN = (req, res, next) => {
  if (req.session && req.session.login) {
    req.session.login.sin = req.body.sin
  }
  next()
}

const postLogin = async (req, res, next) => {
  const _loginError = (req, { id, msg }) => {
    const oldSession = req.session.login || {}
    req.session.login = {
      ...oldSession,
      ...{ errors: { [id]: { msg, param: id } } },
    }
  }

  // if no session, or no access code, return to access code page
  if (!req.session || !req.session.login || !req.session.login.code) {
    _loginError(req, { id: 'code', msg: 'errors.login.code.missing' })
    return res.redirect('/login/code')
  }

  req.session.login.dateOfBirth = _toISOFormat(req.body)
  
  // save each box as the user typed it for usability if there is an error
  req.session.login.dobDay = req.body.dobDay
  req.session.login.dobMonth = req.body.dobMonth
  req.session.login.dobYear = req.body.dobYear

  // if no SIN, return to SIN page
  if (!req.session.login.sin) {
    _loginError(req, { id: 'sin', msg: 'errors.login.missingSIN' })
    return res.redirect('/login/sin')
  }

  // check access code + SIN + DoB
  const { code, sin, dateOfBirth } = req.session.login
  const row = await DB.validateUser({ code, sin, dateOfBirth })

  // if no row is found, error and proceed to error page
  if (!row) {
    return res.redirect('/login/error/doesNotMatch')
  } else if (row.error) {
    // sin and DoB match another access code
    _loginError(req, { id: 'code', msg: 'errors.login.codeMatch' })
    return res.redirect('/login/code')
  }
  // @TODO: process.env.CTBS_SERVICE_URL
  const user = API.getUser(code)

  if (!user) {
    throw new Error(`[POST ${req.path}] user not found for access code "${code}"`)
  }

  // this intentionally overwrites what we have saved in "session.login" up to this point
  Object.keys(user).map(key => (req.session[key] = user[key]))

  next()
}
