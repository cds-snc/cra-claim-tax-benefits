const { checkSchema } = require('express-validator')
const { validateRedirect, checkErrors } = require('./../../utils')
const {
  rrspSchema,
  rrspAmountSchema,
  donationsSchema,
  donationsAmountSchema,
  trilliumRentAmountSchema,
  trilliumPropertyTaxAmountSchema,
  trilliumEnergyAmountSchema,
  trilliumlongTermCareAmountSchema,
} = require('./../../formSchemas.js')

module.exports = function(app) {
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
  app.get('/deductions/donations', (req, res) =>
    res.render('deductions/donations', { data: req.session }),
  )
  app.post(
    '/deductions/donations',
    validateRedirect,
    checkSchema(donationsSchema),
    checkErrors('deductions/donations'),
    postDonations,
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

  //Start of Trillum Section
  app.get('/trillium/rent/amount', (req, res) =>
    res.render('deductions/trillium-rent-amount', { data: req.session }),
  )
  app.post(
    '/trillium/rent/amount',
    validateRedirect,
    checkSchema(trilliumRentAmountSchema),
    checkErrors('deductions/trillium-rent-amount'),
    postTrilliumRentAmount,
  )

  app.get('/trillium/propertyTax/amount', (req, res) =>
    res.render('deductions/trillium-propertyTax-amount', { data: req.session }),
  )
  app.post(
    '/trillium/propertyTax/amount',
    validateRedirect,
    checkSchema(trilliumPropertyTaxAmountSchema),
    checkErrors('deductions/trillium-propertyTax-amount'),
    postTrilliumPropertyTaxAmount,
  )

  app.get('/trillium/energy/amount', (req, res) =>
    res.render('deductions/trillium-energy-amount', { data: req.session }),
  )
  app.post(
    '/trillium/energy/amount',
    validateRedirect,
    checkSchema(trilliumEnergyAmountSchema),
    checkErrors('deductions/trillium-energy-amount'),
    postTrilliumEnergyAmount,
  )

  app.get('/trillium/longTermCare/amount', (req, res) =>
    res.render('deductions/trillium-longTermCare-amount', { data: req.session }),
  )
  app.post(
    '/trillium/longTermCare/amount',
    validateRedirect,
    checkSchema(trilliumlongTermCareAmountSchema),
    checkErrors('deductions/trillium-longTermCare-amount'),
    postTrilliumLongTermCareAmount,
  )
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
const postDonations = (req, res) => {
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

//Start of Trillium controller functions
const postTrilliumRentAmount = (req, res) => {
  req.session.deductions.trilliumRentAmount = req.body.trilliumRentAmount

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}

const postTrilliumPropertyTaxAmount = (req, res) => {
  req.session.deductions.trilliumPropertyTaxAmount = req.body.trilliumPropertyTaxAmount

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}

const postTrilliumEnergyAmount = (req, res) => {
  req.session.deductions.trilliumEnergyAmount = req.body.trilliumEnergyAmount

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}

const postTrilliumLongTermCareAmount = (req, res) => {
  req.session.deductions.trilliumLongTermCareAmount = req.body.trilliumLongTermCareAmount

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}
