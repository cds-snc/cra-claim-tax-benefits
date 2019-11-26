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
const { DB } = require('../../api')
const user = require('../../api/user.json')
const { securityQuestionUrls } = require('../../config/routes.config')

module.exports = function(app) {
  // redirect from "/login" → "/login/code"
  app.get('/login', (req, res) => res.redirect('/login/code'))
  app.get('/login/code', renderWithData('login/code'))
  app.post('/login/code', checkSchema(loginSchema), postLoginCode, doRedirect)

  // SIN
  app.get('/login/sin', renderWithData('login/sin'))
  app.post('/login/sin',
    checkSchema(sinSchema),
    checkErrors('login/sin'),
    (req, res, next) => {
      req.session.personal.sin = req.body.sin
      next()
    },
    doRedirect)

  // Date of Birth
  app.get('/login/dateOfBirth', renderWithData('login/dateOfBirth'))
  app.post('/login/dateOfBirth', checkSchema(dobSchema), postDateOfBirth, doRedirect)

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
  let validCode = DB.validateCode(req.body.code)

  if (!validCode) {
    throw new Error(`[POST ${req.path}] user not found for access code "${req.body.code}"`)
  }

  // populate the session with empty variables in the format of user.json
  // setting req.session = {obj} causes an error, so assign the keys one at a time
  Object.keys(user).map(key => (req.session[key] = {}))

  req.session.login.code = req.body.code
  req.session.personal.firstName = validCode.firstName

  next()
}

const postDateOfBirth = async (req, res, next) => {
  const errors = validationResult(req)

  // copy all posted parameters, but remove the redirect
  let body = Object.assign({}, req.body)
  delete body.redirect

  if (!errors.isEmpty()) {
    let errObj = errorArray2ErrorObject(errors)

    return res.status(422).render('login/dateOfBirth', {
      prevRoute: getPreviousRoute(req),
      data: req.session,
      body,
      errors: errObj,
    })
  }
  req.session.personal.dateOfBirth = _toISOFormat(req.body)

  // check access code + SIN + DoB
  // if session doesn't have a sin, throw error
  if(!req.session.personal.sin) {
    // error no sin
    let errObj = {
      sin: {
        msg: 'errors.login.matchingSIN',
      },
    }
    return res.status(422).render('login/dateOfBirth', {
      prevRoute: getPreviousRoute(req),
      data: req.session,
      body,
      errors: errObj,
    })
  }

  let login = {
    code: req.session.login.code,
    sin: req.session.personal.sin.replace(/\s/g, ''),
    dateOfBirth: req.session.personal.dateOfBirth,
  }
  let validUser = DB.validateUser(login)

  if (validUser) {
    // populate the rest of the session
    // populate from user.json for now
    Object.keys(user).map(key => {
      req.session[key] = user[key]
    })
  } else {
    // TODO: update error message
    let errObj = {
      dateOfBirth: {
        msg: 'errors.login.dateOfBirth.match',
      },
    }

    return res.status(422).render('login/dateOfBirth', {
      prevRoute: getPreviousRoute(req),
      data: req.session,
      body,
      errors: errObj,
    })
  }
  next()
}

const postSecurityQuestion = async (req, res) => {
  const url = securityQuestionUrls.find(urlFound => urlFound === req.body.securityQuestion)

  req.session.login.securityQuestion = url
  return res.redirect(url)
}
