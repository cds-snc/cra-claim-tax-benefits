const { validationResult } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect } = require('./../../utils.js')
//const { loginSchema, sinSchema } = require('./../../formSchemas.js')
//const API = require('../../api')

module.exports = function (app) {
  // redirect from "/deductions" → "/login/code", you really shouldn't be here (Unless we add a "info" page)
  app.get('/deductions', (req, res) => res.redirect('/login/code'))

  app.get('/deductions/rrsp', (req, res) => res.render('deductions/rrsp', { data: req.session || {} }))
  app.post('/deductions/rrsp', validateRedirect, postRRSP)

}

const postRRSP = (req, res) => {

  const errors = validationResult(req)

  //If rrsp is not set, set it to null
  let rrsp = req.body.rrsp || null
  req.session.deductions.rrspClaim = rrsp

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
  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)

}

