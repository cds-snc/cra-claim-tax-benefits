const { validationResult } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect } = require('./../../utils')

module.exports = function(app) {
  app.get('/deductions/rrsp/amount', (req, res) =>
    res.render('deductions/rrsp-amount', { data: req.session || {} }),
  )
  app.post('/deductions/rrsp/amount', validateRedirect, postRRSP)
}

const postRRSP = (req, res) => {
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
