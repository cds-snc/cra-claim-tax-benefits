const { validationResult, checkSchema } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect } = require('./../../utils')
const { rrspSchema } = require('./../../formSchemas.js')

module.exports = function(app) {
  app.get('/deductions/rrsp', (req, res) => res.render('deductions/rrsp', { data: req.session }))
  app.post('/deductions/rrsp', validateRedirect, checkSchema(rrspSchema), postRRSP)

  app.get('/deductions/rrsp/amount', (req, res) =>
    res.render('deductions/rrsp-amount', { data: req.session }),
  )
  app.post('/deductions/rrsp/amount', validateRedirect, postRRSPAmount)
}

const postRRSP = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('deductions/rrsp', {
      data: req.session,
      errors: errorArray2ErrorObject(errors),
    })
  }

  /* TODO: SAVE THIS TO THE SESSION */
  const rrspClaim = req.body.rrspClaim

  if (rrspClaim === 'Yes') {
    // It's fine not having this in the form itself (like the other redirect value)
    // because these two pages are hardcoded together
    return res.redirect('/deductions/rrsp/amount')
  }

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}

const postRRSPAmount = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('deductions/rrsp/amount', {
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
