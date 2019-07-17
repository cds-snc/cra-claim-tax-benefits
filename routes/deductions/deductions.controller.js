const { checkSchema } = require('express-validator')
const { validateRedirect, checkErrors } = require('./../../utils')
const { rrspSchema, rrspAmountSchema, donationsSchema, donationsAmountSchema } = require('./../../formSchemas.js')

module.exports = function (app) {

  //Start of RRSP Section
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
  //End of RRSP Section

  //Start of Charitable Donations Section
  app.get('/deductions/donations', (req, res) => res.render('deductions/donations', { data: req.session }))
  app.post(
    '/deductions/donations',
    validateRedirect,
    checkSchema(donationsSchema),
    checkErrors('deductions/donations'),
    postdonations,
  )
  app.get('/deductions/donations/amount', (req, res) =>
    res.render('deductions/donations-amount', { data: req.session }),
  )
  app.post(
    '/deductions/donations/amount',
    validateRedirect,
    checkSchema(donationsAmountSchema),
    checkErrors('deductions/donations-amount'),
    postDonationsAmount,
  )
  //End of Charitable Donations Section


}

//Start of RRSP controller functions
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
// End of RRSP controller functions

//Start of Charitable Donations controller functions
const postdonations = (req, res) => {
  const donationsClaim = req.body.donationsClaim

  if (donationsClaim === 'Yes') {
    req.session.deductions.donationsClaim = true

    // It's fine not having this in the form itself (like the other redirect value)
    // because these two pages are hardcoded together
    return res.redirect('/deductions/donations/amount')
  }

  req.session.deductions.donationsClaim = false

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}

const postDonationsAmount = (req, res) => {
  req.session.deductions.donationsAmount = req.body.donationsAmount

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}
//End of Charitable Donations controller functions