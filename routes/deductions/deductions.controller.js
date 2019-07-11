const { validationResult } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect } = require('./../../utils.js')

module.exports = function (app) {
  // redirect from "/deductions" → "/login/code", you really shouldn't be here (Unless we add a "info" page)
  app.get('/deductions', (req, res) => res.redirect('/login/code'))

  app.get('/deductions/rrsp', (req, res) => res.render('deductions/rrsp', { data: req.session || {} }))
  app.post('/deductions/rrsp', validateRedirect, postRRSP)

}

const postRRSP = (req, res) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('deductions/rrsp', {
      data: { rrsp: req.body.rrsp } || {},
      errors: errorArray2ErrorObject(errors),
    })
  }

  //If we have an amount and it's truthy (not 0) we set rrspClaim to true and then set the amount
  if (req.body.rrsp) {
    req.session.deductions.rrspClaim = true
    req.session.deductions.rrspAmount = req.body.rrsp
  } else {
    //If we don't have an amount then we assume the user has removed any RRSP deductions
    req.session.deductions.rrspClaim = false
    req.session.deductions.rrspAmount = 0
  }

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)

}

