const { validationResult, checkSchema } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect } = require('./../../utils.js')
const { loginSchema } = require('./../../formSchemas.js')
const API = require('../../api')

module.exports = function(app) {
  // redirect from "/login" → "/login/code"
  app.get('/login', (req, res) => res.redirect('/login/code'))
  app.get('/login/code', (req, res) => res.render('login/code', { data: req.session || {} }))
  app.post('/login/code', checkSchema(loginSchema), validateRedirect, postLoginCode)
  app.get('/login/success', (req, res) => res.render('login/success', { data: req.session || {} }))

  //SIN
  app.get('/login/sin', (req, res) => res.render('login/sin', { data: req.session || {} }))
  app.post('/login/sin', validateRedirect, postSIN)
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

  //If sin is not set, set it to null
  let sin = req.body.sin || null
  req.session.sin = sin

  //Success, we can redirect to the next page
  if (sin && redirect) {
    return res.redirect(req.body.redirect)
  }

  //Sad Trombone
  res.status(422).render('login/sin', { title: 'Enter your SIN', data: req.session || {} })
}
