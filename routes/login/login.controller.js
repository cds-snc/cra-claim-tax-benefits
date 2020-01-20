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
  eligibleDependentsSchema,
  eligibleDependentsClaimSchema,
  tuitionSchema,
  tuitionClaimSchema,
  incomeSourcesSchema,
  foreignIncomeSchema,
  childrenSchema,
  taxableIncomeSchema,
  ageSchema,
  residenceScreeningSchema,
} = require('./../../schemas')
const API = require('../../api')
const DB = require('../../db')

module.exports = function(app) {
  app.get('/eligibility/age', renderWithData('login/eligibility-age'))
  app.post(
    '/eligibility/age',
    checkSchema(ageSchema),
    checkErrors('login/eligibility-age'),
    postAge,
    doRedirect,
  )

  app.get('/eligibility/taxable-income', renderWithData('login/eligibility-taxable-income'))
  app.post(
    '/eligibility/taxable-income',
    checkSchema(taxableIncomeSchema),
    checkErrors('login/eligibility-taxable-income'),
    postTaxableIncome,
    doRedirect,
  )

  app.get('/eligibility/residence', renderWithData('login/eligibility-residence'))
  app.post(
    '/eligibility/residence',
    checkSchema(residenceScreeningSchema),
    checkErrors('login/eligibility-residence'),
    postResidenceScreening,
    doRedirect,
  )

  app.get('/eligibility/children', renderWithData('login/eligibility-children'))
  app.post(
    '/eligibility/children',
    checkSchema(childrenSchema),
    checkErrors('login/eligibility-children'),
    postChildren,
    doRedirect,
  )

  app.get('/eligibility/dependants', renderWithData('login/eligibility-dependants'))
  app.post(
    '/eligibility/dependants',
    checkSchema(eligibleDependentsSchema),
    checkErrors('login/eligibility-dependants'),
    postEligibleDependents,
    doRedirect,
  )

  app.get('/eligibility/dependants-claim', renderWithData('login/eligibility-dependants-claim'))
  app.post(
    '/eligibility/dependants-claim',
    checkSchema(eligibleDependentsClaimSchema),
    checkErrors('login/eligibility-dependants-claim'),
    postEligibleDependentsClaim,
    doRedirect,
  )

  app.get('/eligibility/tuition', renderWithData('login/eligibility-tuition'))
  app.post(
    '/eligibility/tuition',
    checkSchema(tuitionSchema),
    checkErrors('login/eligibility-tuition'),
    postTuition,
    doRedirect,
  )

  app.get('/eligibility/tuition-claim', renderWithData('login/eligibility-tuition-claim'))
  app.post(
    '/eligibility/tuition-claim',
    checkSchema(tuitionClaimSchema),
    checkErrors('login/eligibility-tuition-claim'),
    postTuitionClaim,
    doRedirect,
  )

  app.get('/eligibility/income-sources', renderWithData('login/eligibility-income-sources'))
  app.post(
    '/eligibility/income-sources',
    checkSchema(incomeSourcesSchema),
    checkErrors('login/eligibility-income-sources'),
    postIncomeSources,
    doRedirect,
  )

  app.get('/eligibility/foreign-income', renderWithData('login/eligibility-foreign-income'))
  app.post(
    '/eligibility/foreign-income',
    checkSchema(foreignIncomeSchema),
    checkErrors('login/eligibility-foreign-income'),
    postForeignIncome,
    doRedirect,
  )

  app.get('/eligibility/success', renderWithData('login/eligibility-success'))

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
  req.session.login = { code: row.code, firstName: row.first_name }

  next()
}

const postSIN = (req, res, next) => {
  if (req.session && req.session.login) {
    req.session.login.sin = req.body.sin
  }
  next()
}

const _loginError = (req, { id, msg }) => {
  const oldSession = req.session.login || {}
  req.session.login = {
    ...oldSession,
    ...{ errors: { [id]: { msg, param: id } } },
  }
}

const postLogin = async (req, res, next) => {
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

const postAge = (req, res, next) => {
  const ageYesNo = req.body.ageYesNo

  req.session.login.ageYesNo = ageYesNo

  next()
}

const postTaxableIncome = (req, res, next) => {
  const taxableIncome = req.body.taxableIncome

  req.session.login.taxableIncome = taxableIncome

  if (taxableIncome === 'No') {
    return res.redirect('/offramp/taxable-income')
  }

  next()
}

const postResidenceScreening = (req, res, next) => {
  const residenceScreening = req.body.residenceScreening

  req.session.login.residenceScreening = residenceScreening

  if (residenceScreening === 'No') {
    return res.redirect('/offramp/residence')
  }

  next()
}

const postChildren = (req, res, next) => {
  const children = req.body.children

  req.session.login.children = children

  if (children === 'Yes') {
    return res.redirect('/offramp/children')
  }

  next()
}

const postEligibleDependents = (req, res, next) => {
  const eligibleDependents = req.body.eligibleDependents

  req.session.login.eligibleDependents = eligibleDependents

  if (eligibleDependents === 'Yes') {
    return res.redirect('/eligibility/dependants-claim')
  }

  req.session.login.eligibleDependentsClaim = null

  next()
}

const postEligibleDependentsClaim = (req, res, next) => {
  const eligibleDependentsClaim = req.body.eligibleDependentsClaim

  req.session.login.eligibleDependentsClaim = eligibleDependentsClaim

  if (eligibleDependentsClaim === 'Yes') {
    return res.redirect('/offramp/dependants')
  }

  next()
}

const postTuition = (req, res, next) => {
  const tuition = req.body.tuition

  req.session.login.tuition = tuition

  if (tuition === 'Yes') {
    return res.redirect('/eligibility/tuition-claim')
  }

  req.session.login.tuitionClaim = null

  next()
}

const postTuitionClaim = (req, res, next) => {
  const tuitionClaim = req.body.tuitionClaim

  req.session.login.tuitionClaim = tuitionClaim

  if (tuitionClaim === 'Yes') {
    return res.redirect('/offramp/tuition')
  }

  next()
}

const postIncomeSources = (req, res, next) => {
  const incomeSources = req.body.incomeSources

  req.session.login.incomeSources = incomeSources

  if (incomeSources === 'Yes') {
    return res.redirect('/offramp/income-sources')
  }

  next()
}

const postForeignIncome = (req, res, next) => {
  const foreignIncome = req.body.foreignIncome

  req.session.login.foreignIncome = foreignIncome

  if (foreignIncome === 'Yes') {
    return res.redirect('/offramp/foreign-income')
  }

  next()
}
