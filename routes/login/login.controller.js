const { validationResult, checkSchema } = require('express-validator')
const { errorArray2ErrorObject } = require('./../../utils.js')
const { loginSchema } = require('./../../formSchemas.js')
const API = require('../../api')

module.exports = function(app) {
  // redirect from "/login" → "/login/code"
  app.get('/login', (req, res) => res.redirect('/login/code'))
  app.get('/login/code', (req, res) => res.render('login/code', { data: req.session || {} }))
  app.post('/login/code', checkSchema(loginSchema), postLoginCode)
  app.get('/login/success', (req, res) => res.render('login/success', { data: req.session || {} }))

  //SIN
  app.get('/login/sin', (req, res) => res.render('login/sin', { data: req.session || {} }))
  app.post('/login/sin', postSIN)
}

//POST functions that handle setting the login data in the session and handle redirecting to the next page or sending an error to the client.
//Note that this is not the only error validation, see routes defined above.
const validateRedirect = req => {
  let redirect = req.body.redirect || null
  if (!redirect) {
    throw new Error(`[POST ${req.path}] 'redirect' parameter missing`)
  }
  return redirect
}

const postLoginCode = (req, res) => {
  const redirect = validateRedirect(req, res)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // clear session
    req.session = null

    return res
      .status(422)
      .render('login/code', { data: req.session || {}, errors: errorArray2ErrorObject(errors) })
  }

  let user = API.getUser(req.body.code || null)

  if (!user) {
    throw new Error(`[POST ${req.path}] user not found for access code "${req.body.code}"`)
  }

  req.session = user
  return res.redirect(redirect)
}

const postSIN = (req, res) => {
  const redirect = validateRedirect(req, res)

  //If sin is not set, set it to null
  let sin = req.body.sin || null
  req.session.sin = sin

  //Success, we can redirect to the next page
  if (sin && redirect) {
    return res.redirect(redirect)
  }

  //Sad Trombone
  res.status(422).render('login/sin', { title: 'Enter your SIN', data: req.session || {} })
}
