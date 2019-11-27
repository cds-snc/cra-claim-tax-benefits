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
  noticeSchema,
  securityQuestionSchema,
  childSchema,
  dateOfResidenceSchema,
  bankruptcySchema,
  bankSchema,
  taxReturnSchema,
  rrspSchema,
  tfsaSchema,
  ccbSchema,
  addressesSchema,
  prisonSchema,
} = require('./../../schemas')
const API = require('../../api')
const DB = require('../../db')
const { securityQuestionUrls } = require('../../config/routes.config')

module.exports = function(app) {
  // redirect from "/login" → "/login/code"
  app.get('/login', (req, res) => res.redirect('/login/code'))
  app.get('/login/code', renderWithData('login/code'))
  app.post('/login/code', checkSchema(loginSchema), postLoginCode, doRedirect)

  // SIN
  // @TODO: redirect if no code
  app.get('/login/sin', renderWithData('login/sin'))
  app.post('/login/sin', checkSchema(sinSchema), checkErrors('login/sin'), postSIN, doRedirect)

  // Date of Birth
  // @TODO: redirect if no code or SIN
  app.get('/login/dateOfBirth', renderWithData('login/dateOfBirth'))
  app.post(
    '/login/dateOfBirth',
    checkSchema(dobSchema),
    checkErrors('login/dateOfBirth'),
    postLogin,
    doRedirect,
  )

  app.get('/login/notice', renderWithData('login/notice'))
  app.post(
    '/login/notice',
    checkSchema(noticeSchema),
    checkErrors('login/notice'),
    (req, res, next) => {
      if (req.body.noticeOfAssessment === 'Yes') {
        return res.redirect('/login/securityQuestion')
      }
      next()
    },
    doRedirect,
  )

  // Security question page
  app.get('/login/securityQuestion', renderWithData('login/securityQuestion'))
  app.post(
    '/login/securityQuestion',
    checkSchema(securityQuestionSchema),
    checkErrors('login/securityQuestion'),
    postSecurityQuestion,
  )

  // Alternate security question page
  app.get('/login/securityQuestion2', renderWithData('login/securityQuestion2'))
  app.post(
    '/login/securityQuestion2',
    checkSchema(securityQuestionSchema),
    checkErrors('login/securityQuestion2'),
    postSecurityQuestion,
  )

  app.get('/login/questions', (req, res) => res.redirect('/login/securityQuestion'))

  // Security questions
  app.get('/login/questions/child', renderWithData('login/questions/child'))
  app.post(
    '/login/questions/child',
    checkSchema(childSchema),
    checkErrors('login/questions/child'),
    doRedirect,
  )

  app.get('/login/questions/addresses', renderWithData('login/questions/addresses'))
  app.post(
    '/login/questions/addresses',
    checkSchema(addressesSchema),
    checkErrors('login/questions/addresses'),
    doRedirect,
  )

  app.get('/login/questions/prison', renderWithData('login/questions/prison'))
  app.post(
    '/login/questions/prison',
    checkSchema(prisonSchema),
    checkErrors('login/questions/prison'),
    doRedirect,
  )

  app.get('/login/questions/dateOfResidence', renderWithData('login/questions/dateOfResidence'))
  app.post(
    '/login/questions/dateOfResidence',
    checkSchema(dateOfResidenceSchema),
    checkErrors('login/questions/dateOfResidence'),
    doRedirect,
  )

  app.get('/login/questions/bankruptcy', renderWithData('login/questions/bankruptcy'))
  app.post(
    '/login/questions/bankruptcy',
    checkSchema(bankruptcySchema),
    checkErrors('login/questions/bankruptcy'),
    doRedirect,
  )

  app.get('/login/questions/bank', renderWithData('login/questions/bank'))
  app.post(
    '/login/questions/bank',
    checkSchema(bankSchema),
    checkErrors('login/questions/bank'),
    doRedirect,
  )

  app.get('/login/questions/taxReturn', renderWithData('login/questions/taxReturn'))
  app.post(
    '/login/questions/taxReturn',
    checkSchema(taxReturnSchema),
    checkErrors('login/questions/taxReturn'),
    doRedirect,
  )

  app.get('/login/questions/rrsp', renderWithData('login/questions/rrsp'))
  app.post(
    '/login/questions/rrsp',
    checkSchema(rrspSchema),
    checkErrors('login/questions/rrsp'),
    doRedirect,
  )

  app.get('/login/questions/tfsa', renderWithData('login/questions/tfsa'))
  app.post(
    '/login/questions/tfsa',
    checkSchema(tfsaSchema),
    checkErrors('login/questions/tfsa'),
    doRedirect,
  )

  app.get('/login/questions/ccb', renderWithData('login/questions/ccb'))
  app.post(
    '/login/questions/ccb',
    checkSchema(ccbSchema),
    checkErrors('login/questions/ccb'),
    doRedirect,
  )
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
  let row = DB.validateCode(req.body.code)

  if (!row) {
    throw new Error(`[POST ${req.path}] user not found for access code "${req.body.code}"`)
  }

  // populate the session.login with our submitted access code
  req.session.login = { code: req.body.code }

  next()
}

const postSIN = (req, res, next) => {
  if (req.session && req.session.login) {
    req.session.login.sin = req.body.sin
  }
  next()
}

const postLogin = async (req, res, next) => {
  // if no session, or no access code, return to access code page
  // @TODO: test for this
  // @TODO: this should be an error
  if (!req.session || !req.session.login || !req.session.login.code) {
    req.session.destroy()
    return res.redirect('/login/code')
  }

  // if no SIN, return to SIN page
  // @TODO: test for this
  // @TODO: this should be an error
  if (!req.session.login.sin) {
    return res.redirect('/login/sin')
  }

  req.session.login.dateOfBirth = _toISOFormat(req.body)

  // check access code + SIN + DoB
  const { code, sin, dateOfBirth } = req.session.login

  let row = DB.validateUser({ code, sin, dateOfBirth })

  // if no row is found, error and return to SIN page
  if (!row) {
    // @TODO: this should be an error
    // @TODO: error might be that the SIN and DoB are for another code, don't handle that right now
    return res.redirect('/login/sin')
  }

  // @TODO: process.env.CTBS_SERVICE_URL
  const user = API.getUser(code)

  if (!user) {
    throw new Error(`[POST ${req.path}] user not found for access code "${code}"`)
  }

  // this overwrites what we have saved in "session.login" up to this point
  Object.keys(user).map(key => (req.session[key] = user[key]))

  next()
}

const postSecurityQuestion = async (req, res) => {
  const url = securityQuestionUrls.find(urlFound => urlFound === req.body.securityQuestion)

  req.session.login.securityQuestion = url
  return res.redirect(url)
}
