const { validationResult, checkSchema } = require('express-validator')
const { errorArray2ErrorObject } = require('./../../utils.js')
//const { loginSchema, sinSchema } = require('./../../formSchemas.js')
const API = require('../../api')

module.exports = function (app) {
  // redirect from "/deductions" → "/login/code", you really shouldn't be here (Unless we add a "info" page)
  app.get('/deductions', (req, res) => res.redirect('/login/code'))

  app.get('/deductions/rrsp', (req, res) => res.render('deductions/rrsp', { data: req.session || {} }))
  app.post('/deductions/rrsp', checkSchema(stub), postRRSP)

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

const postRRSP = (req, res) => {
  const redirect = validateRedirect(req, res)

  const errors = validationResult(req)

  //If sin is not set, set it to null
  let rrsp = req.body.rrsp || null
  req.session.credits.rrspClaim = rrsp

  if (!errors.isEmpty()) {
    return res.status(422).render('deductions/rrsp', {
      data: { rrsp: req.body.rrsp } || {},
      errors: errorArray2ErrorObject(errors),
    })
  }

  //Success, we can redirect to the next page
  if (rrsp && redirect) {
    return res.redirect(redirect)
  }

  //No errors, but didn't process. Unsure if this code branch is reachable but it's a good safety.
  res.status(422).render('deductions/rrsp', { data: req.session || {} })

}

