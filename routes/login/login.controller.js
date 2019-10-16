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
  sinSchema,
  dobSchema,
  securityQuestionSchema,
  childSchema,
  dateOfResidenceSchema,
  bankruptcySchema,
  trilliumAmountSchema,
  addressesSchema,
  prisonSchema,
} = require('./../../schemas')
const API = require('../../api')
const { securityQuestionUrls } = require('../../config/routes.config')

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

  app.get('/login/questions/trillium', renderWithData('login/questions/trillium'))
  app.post(
    '/login/questions/trillium',
    checkSchema(trilliumAmountSchema),
    checkErrors('login/questions/trillium'),
    doRedirect,
  )

  app.get('/login/questions/temp', renderWithData('login/questions/temp'))
}

const postLoginCode = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // clear session
    req.session = null

    return res.status(422).render('login/code', {
      prevRoute: getPreviousRoute(req),
      data: { code: req.body.code },
      errors: errorArray2ErrorObject(errors),
    })
  }

  const user = API.getUser('A5G98S4K1')

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
      prevRoute: getPreviousRoute(req),
      data: req.session,
      body,
      errors: errObj,
    })
  }

  next()
}

const postSecurityQuestion = async (req, res) => {
  const url = securityQuestionUrls.find(url => url === req.body.securityQuestion)

  req.session.login.securityQuestion = url
  return res.redirect(url)
}
