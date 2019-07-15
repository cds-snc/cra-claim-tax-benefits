const { checkSchema } = require('express-validator')
const { validateRedirect, checkErrors } = require('./../../utils')
const { rrspSchema, rrspAmountSchema } = require('./../../formSchemas.js')

module.exports = function(app) {
  app.get('/deductions/rrsp', (req, res) => res.render('deductions/rrsp', { data: req.session }))
  app.post(
    '/deductions/rrsp',
    validateRedirect,
    checkSchema(rrspSchema),
    checkErrors('deductions/rrsp'),
    postRRSP,
  )

  app.get('/deductions/rrsp/amount', (req, res) =>
    res.render('deductions/rrsp-amount', { data: req.session }),
  )
  app.post(
    '/deductions/rrsp/amount',
    validateRedirect,
    checkSchema(rrspAmountSchema),
    checkErrors('deductions/rrsp-amount'),
    postRRSPAmount,
  )
}

const postRRSP = (req, res) => {
  const rrspClaim = req.body.rrspClaim

  if (rrspClaim === 'Yes') {
    req.session.deductions.rrspClaim = true

    // It's fine not having this in the form itself (like the other redirect value)
    // because these two pages are hardcoded together
    return res.redirect('/deductions/rrsp/amount')
  }

  req.session.deductions.rrspClaim = false

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}

const postRRSPAmount = (req, res) => {
  req.session.deductions.rrspAmount = req.body.rrspAmount

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}
