const { validationResult, checkSchema } = require('express-validator')
const request = require('request-promise')
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
  noticeSchema,
  securityQuestionSchema,
  childSchema,
  dateOfResidenceSchema,
  bankruptcySchema,
  trilliumAmountSchema,
  bankSchema,
  taxReturnSchema,
  rrspSchema,
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

  app.get('/login/notice', renderWithData('login/notice'))
  app.post(
    '/login/notice',
    checkSchema(noticeSchema),
    checkErrors('login/notice'),
    (req, res, next) => {
      if (req.body.noticeOfAssessment === 'No') {
        return res.redirect('/checkAnswers')
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

  app.get('/login/questions/trillium', renderWithData('login/questions/trillium'))
  app.post(
    '/login/questions/trillium',
    checkSchema(trilliumAmountSchema),
    checkErrors('login/questions/trillium'),
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

  app.get('/login/questions/temp', renderWithData('login/questions/temp'))
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

  // setting req.session = {obj} causes an error, so assign the keys one at a time
  Object.keys(user).map(key => (req.session[key] = user[key]))

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
  const url = securityQuestionUrls.find(urlFound => urlFound === req.body.securityQuestion)

  req.session.login.securityQuestion = url
  return res.redirect(url)
}
