const { checkSchema } = require('express-validator')
const { validateRedirect, renderWithData, checkErrors } = require('./../../utils')
const {
  rrspSchema,
  rrspAmountSchema,
  donationsSchema,
  donationsAmountSchema,
  politicalSchema,
  politicalAmountSchema,
  medicalSchema,
  medicalAmountSchema,
  trilliumRentAmountSchema,
  trilliumPropertyTaxAmountSchema,
  trilliumStudentResidenceSchema,
  trilliumEnergyAmountSchema,
  trilliumlongTermCareAmountSchema,
  climateActionIncentiveSchema,
} = require('./../../schemas')

module.exports = function(app) {
  //Start of RRSP Section
  app.get('/deductions/rrsp', renderWithData('deductions/rrsp'))
  app.post(
    '/deductions/rrsp',
    validateRedirect,
    checkSchema(rrspSchema),
    checkErrors('deductions/rrsp'),
    postRRSP,
  )
  app.get('/deductions/rrsp/amount', renderWithData('deductions/rrsp-amount'))
  app.post(
    '/deductions/rrsp/amount',
    validateRedirect,
    checkSchema(rrspAmountSchema),
    checkErrors('deductions/rrsp-amount'),
    postRRSPAmount,
  )
  //End of RRSP Section

  //Start of Charitable Donations Section
  app.get('/deductions/donations', renderWithData('deductions/donations'))
  app.post(
    '/deductions/donations',
    validateRedirect,
    checkSchema(donationsSchema),
    checkErrors('deductions/donations'),
    postDonations,
  )
  app.get('/deductions/donations/amount', renderWithData('deductions/donations-amount'))
  app.post(
    '/deductions/donations/amount',
    validateRedirect,
    checkSchema(donationsAmountSchema),
    checkErrors('deductions/donations-amount'),
    postDonationsAmount,
  )
  //End of Charitable Donations Section

  //Start of Medical claim Section
  app.get('/deductions/medical', renderWithData('deductions/medical'))
  app.post(
    '/deductions/medical',
    validateRedirect,
    checkSchema(medicalSchema),
    checkErrors('deductions/medical'),
    postMedical,
  )
  app.get('/deductions/medical/amount', renderWithData('deductions/medical-amount'))
  app.post(
    '/deductions/medical/amount',
    validateRedirect,
    checkSchema(medicalAmountSchema),
    checkErrors('deductions/medical-amount'),
    postMedicalAmount,
  )
  //End of Medical Claim Section

  //Start of Political Donations Section
  app.get('/deductions/political', renderWithData('deductions/political'))
  app.post(
    '/deductions/political',
    validateRedirect,
    checkSchema(politicalSchema),
    checkErrors('deductions/political'),
    postPolitical,
  )
  app.get('/deductions/political/amount', renderWithData('deductions/political-amount'))
  app.post(
    '/deductions/political/amount',
    validateRedirect,
    checkSchema(politicalAmountSchema),
    checkErrors('deductions/political-amount'),
    postPoliticalAmount,
  )
  //End of Charitable Donations Section

  //Start of Trillum Section
  app.get('/trillium/rent/amount', renderWithData('deductions/trillium-rent-amount'))
  app.post(
    '/trillium/rent/amount',
    validateRedirect,
    checkSchema(trilliumRentAmountSchema),
    checkErrors('deductions/trillium-rent-amount'),
    postTrilliumRentAmount,
  )

  app.get('/trillium/propertyTax/amount', renderWithData('deductions/trillium-propertyTax-amount'))
  app.post(
    '/trillium/propertyTax/amount',
    validateRedirect,
    checkSchema(trilliumPropertyTaxAmountSchema),
    checkErrors('deductions/trillium-propertyTax-amount'),
    postTrilliumPropertyTaxAmount,
  )

  app.get('/trillium/studentResidence', renderWithData('deductions/trillium-studentResidence'))
  app.post(
    '/trillium/studentResidence',
    validateRedirect,
    checkSchema(trilliumStudentResidenceSchema),
    checkErrors('deductions/trillium-studentResidence'),
    postTrilliumStudentResidence,
  )

  app.get('/trillium/energy/amount', renderWithData('deductions/trillium-energy-amount'))
  app.post(
    '/trillium/energy/amount',
    validateRedirect,
    checkSchema(trilliumEnergyAmountSchema),
    checkErrors('deductions/trillium-energy-amount'),
    postTrilliumEnergyAmount,
  )

  app.get(
    '/trillium/longTermCare/amount',
    renderWithData('deductions/trillium-longTermCare-amount'),
  )
  app.post(
    '/trillium/longTermCare/amount',
    validateRedirect,
    checkSchema(trilliumlongTermCareAmountSchema),
    checkErrors('deductions/trillium-longTermCare-amount'),
    postTrilliumLongTermCareAmount,
  )

  //Climate Action Incentive
  app.get(
    '/deductions/climate-action-incentive',
    renderWithData('deductions/climate-action-incentive'),
  )
  app.post(
    '/deductions/climate-action-incentive',
    validateRedirect,
    checkSchema(climateActionIncentiveSchema),
    checkErrors('deductions/climate-action-incentive'),
    postClimateActionIncentiveSchema,
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
  req.session.deductions.rrspAmount.amount = req.body.rrspAmount

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}
// End of RRSP controller functions

//Start of Charitable Donations controller functions
const postDonations = (req, res) => {
  const donationsClaim = req.body.donationsClaim

  if (donationsClaim === 'Yes') {
    req.session.deductions.charitableDonationClaim = true

    // It's fine not having this in the form itself (like the other redirect value)
    // because these two pages are hardcoded together
    return res.redirect('/deductions/donations/amount')
  }

  req.session.deductions.charitableDonationClaim = false

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}

const postDonationsAmount = (req, res) => {
  req.session.deductions.charitableDonationAmount = req.body.donationsAmount

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}
//End of Charitable Donations controller functions

//Start of Medical claim controller functions
const postMedical = (req, res) => {
  const medicalClaim = req.body.medicalClaim

  if (medicalClaim === 'Yes') {
    req.session.deductions.medicalExpenseClaim = true

    // It's fine not having this in the form itself (like the other redirect value)
    // because these two pages are hardcoded together
    return res.redirect('/deductions/medical/amount')
  }

  req.session.deductions.medicalExpenseClaim = false

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}

const postMedicalAmount = (req, res) => {
  req.session.deductions.medicalExpenseClaimAmount.amount = req.body.medicalAmount

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}
//End of Medical claim controller functions

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

const postTrilliumStudentResidence = (req, res) => {
  req.session.deductions.trilliumStudentResidence =
    req.body.trilliumStudentResidence === 'Yes' ? true : false

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

//Start of Political Political controller functions
const postPolitical = (req, res) => {
  const politicalClaim = req.body.politicalClaim

  if (politicalClaim === 'Yes') {
    req.session.deductions.politicalClaim = true

    // It's fine not having this in the form itself (like the other redirect value)
    // because these two pages are hardcoded together
    return res.redirect('/deductions/political/amount')
  }

  req.session.deductions.politicalClaim = false

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}

const postPoliticalAmount = (req, res) => {
  req.session.deductions.politicalFederalAmount = req.body.politicalFederalAmount
  req.session.deductions.politicalProvincialAmount = req.body.politicalProvincialAmount
  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}

const postClimateActionIncentiveSchema = (req, res) => {
  req.session.deductions.climateActionIncentiveIsRural = req.body.climateActionIncentiveIsRural
  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}
