const { validationResult, checkSchema } = require('express-validator')
const {
  errorArray2ErrorObject
} = require('./../../utils.js')
const {
  loginSchema
} = require('./../../formSchemas.js')

module.exports = function(app) {
  // redirect from "/login" → "/login/accessCode"
  app.get('/login', (req, res) => res.redirect('/login/code'))
  app.get('/login/code', (req, res) =>
    res.render('login/code', { title: 'Enter access code', data: req.session || {} }),
  )
  app.post('/login/code', checkSchema(loginSchema), postCode)
  app.get('/login/success', (req, res) =>
    res.render('login/success', { title: 'Your access code', data: req.session || {} }),
  )
}

const postCode = (req, res) => {
  let redirect = req.body.redirect || null
  if (!redirect) {
    throw new Error(`[POST ${req.path}] 'redirect' parameter missing`)
  }

  let accessCode = req.body.code || null
  req.session = accessCode ? { code: accessCode } : null

  if (accessCode && redirect) {
    return res.redirect(redirect)
  }

  const errors = validationResult(req)

  res.status(422).render('login/code', { title: 'Enter access code', data: req.session || {}, errors: errorArray2ErrorObject(errors) })
}
