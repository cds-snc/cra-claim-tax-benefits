const { validationResult, checkSchema } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect, checkErrors } = require('./../../utils')
const { loginSchema, sinSchema, birthSchema } = require('./../../formSchemas.js')
const API = require('../../api')

module.exports = function(app) {
  // redirect from "/login" → "/login/code"
  app.get('/login', (req, res) => res.redirect('/login/code'))
  app.get('/login/code', (req, res) => res.render('login/code', { data: req.session || {} }))
  app.post('/login/code', validateRedirect, checkSchema(loginSchema), postLoginCode)

  // SIN
  app.get('/login/sin', (req, res) => res.render('login/sin', { data: req.session }))
  app.post(
    '/login/sin',
    validateRedirect,
    checkSchema(sinSchema),
    checkErrors('login/sin'),
    postSIN,
  )

  // Date of Birth
  app.get('/login/dateOfBirth', (req, res) =>
    res.render('login/dateOfBirth', { data: req.session || {} }),
  )
  app.post(
    '/login/dateOfBirth',
    validateRedirect,
    checkSchema(birthSchema),
    checkErrors('login/dateOfBirth'),
    postDoB,
  )

  // Success page
  app.get('/login/success', (req, res) => res.render('login/success', { data: req.session }))
}

const postLoginCode = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // clear session
    req.session = null

    return res.status(422).render('login/code', {
      data: { code: req.body.code } || {},
      errors: errorArray2ErrorObject(errors),
    })
  }

  let user = API.getUser(req.body.code || null)

  if (!user) {
    throw new Error(`[POST ${req.path}] user not found for access code "${req.body.code}"`)
  }

  req.session = user
  return res.redirect(req.body.redirect)
}

const postSIN = (req, res) => {
  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}

const postDoB = (req, res) => {
  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}
