const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors } = require('./../../utils')
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
    checkSchema(rrspSchema),
    checkErrors('deductions/rrsp'),
    postRRSP,
    doRedirect,
  )
  app.get('/deductions/rrsp/amount', renderWithData('deductions/rrsp-amount'))
  app.post(
    '/deductions/rrsp/amount',
    checkSchema(rrspAmountSchema),
    checkErrors('deductions/rrsp-amount'),
    (req, res, next) => {
      req.session.deductions.rrspAmount.amount = req.body.rrspAmount
      next()
    },
    doRedirect,
  )
  //End of RRSP Section

  //Start of Charitable Donations Section
  app.get('/deductions/donations', renderWithData('deductions/donations'))
  app.post(
    '/deductions/donations',
    checkSchema(donationsSchema),
    checkErrors('deductions/donations'),
    postDonations,
    doRedirect,
  )
  app.get('/deductions/donations/amount', renderWithData('deductions/donations-amount'))
  app.post(
    '/deductions/donations/amount',
    checkSchema(donationsAmountSchema),
    checkErrors('deductions/donations-amount'),
    (req, res, next) => {
      req.session.deductions.charitableDonationAmount = req.body.donationsAmount
      next()
    },
    doRedirect,
  )
  //End of Charitable Donations Section

  //Start of Medical claim Section
  app.get('/deductions/medical', renderWithData('deductions/medical'))
  app.post(
    '/deductions/medical',
    checkSchema(medicalSchema),
    checkErrors('deductions/medical'),
    postMedical,
    doRedirect,
  )
  app.get('/deductions/medical/amount', renderWithData('deductions/medical-amount'))
  app.post(
    '/deductions/medical/amount',
    checkSchema(medicalAmountSchema),
    checkErrors('deductions/medical-amount'),
    (req, res, next) => {
      req.session.deductions.medicalExpenseClaimAmount.amount = req.body.medicalAmount
      next()
    },
    doRedirect,
  )
  //End of Medical Claim Section

  //Start of Political Donations Section
  app.get('/deductions/political', renderWithData('deductions/political'))
  app.post(
    '/deductions/political',
    checkSchema(politicalSchema),
    checkErrors('deductions/political'),
    postPolitical,
    doRedirect,
  )
  app.get('/deductions/political/amount', renderWithData('deductions/political-amount'))
  app.post(
    '/deductions/political/amount',
    checkSchema(politicalAmountSchema),
    checkErrors('deductions/political-amount'),
    (req, res, next) => {
      req.session.deductions.politicalFederalAmount = req.body.politicalFederalAmount
      req.session.deductions.politicalProvincialAmount = req.body.politicalProvincialAmount
      next()
    },
    doRedirect,
  )
  //End of Charitable Donations Section

  //Start of Trillum Section
  app.get('/trillium/rent/amount', renderWithData('deductions/trillium-rent-amount'))
  app.post(
    '/trillium/rent/amount',
    checkSchema(trilliumRentAmountSchema),
    checkErrors('deductions/trillium-rent-amount'),
    (req, res, next) => {
      req.session.deductions.trilliumRentAmount = req.body.trilliumRentAmount
      next()
    },
    doRedirect,
  )

  app.get('/trillium/propertyTax/amount', renderWithData('deductions/trillium-propertyTax-amount'))
  app.post(
    '/trillium/propertyTax/amount',
    checkSchema(trilliumPropertyTaxAmountSchema),
    checkErrors('deductions/trillium-propertyTax-amount'),
    (req, res, next) => {
      req.session.deductions.trilliumPropertyTaxAmount = req.body.trilliumPropertyTaxAmount
      next()
    },
    doRedirect,
  )

  app.get('/trillium/studentResidence', renderWithData('deductions/trillium-studentResidence'))
  app.post(
    '/trillium/studentResidence',
    checkSchema(trilliumStudentResidenceSchema),
    checkErrors('deductions/trillium-studentResidence'),
    (req, res, next) => {
      req.session.deductions.trilliumStudentResidence =
        req.body.trilliumStudentResidence === 'Yes' ? true : false
      next()
    },
    doRedirect,
  )

  app.get('/trillium/energy/amount', renderWithData('deductions/trillium-energy-amount'))
  app.post(
    '/trillium/energy/amount',
    checkSchema(trilliumEnergyAmountSchema),
    checkErrors('deductions/trillium-energy-amount'),
    (req, res, next) => {
      req.session.deductions.trilliumEnergyAmount = req.body.trilliumEnergyAmount
      next()
    },
    doRedirect,
  )

  app.get(
    '/trillium/longTermCare/amount',
    renderWithData('deductions/trillium-longTermCare-amount'),
  )
  app.post(
    '/trillium/longTermCare/amount',
    checkSchema(trilliumlongTermCareAmountSchema),
    checkErrors('deductions/trillium-longTermCare-amount'),
    (req, res, next) => {
      req.session.deductions.trilliumLongTermCareAmount = req.body.trilliumLongTermCareAmount
      next()
    },
    doRedirect,
  )

  //Climate Action Incentive
  app.get(
    '/deductions/climate-action-incentive',
    renderWithData('deductions/climate-action-incentive'),
  )
  app.post(
    '/deductions/climate-action-incentive',
    checkSchema(climateActionIncentiveSchema),
    checkErrors('deductions/climate-action-incentive'),
    (req, res, next) => {
      req.session.deductions.climateActionIncentiveIsRural = req.body.climateActionIncentiveIsRural
      next()
    },
    doRedirect,
  )
}

//Start of RRSP controller functions
const postRRSP = (req, res, next) => {
  const rrspClaim = req.body.rrspClaim

  if (rrspClaim === 'Yes') {
    req.session.deductions.rrspClaim = true

    // These two pages are hardcoded together
    return res.redirect('/deductions/rrsp/amount')
  }

  req.session.deductions.rrspClaim = false

  next()
}
// End of RRSP controller functions

//Start of Charitable Donations controller functions
const postDonations = (req, res, next) => {
  const donationsClaim = req.body.donationsClaim

  if (donationsClaim === 'Yes') {
    req.session.deductions.charitableDonationClaim = true

    // These two pages are hardcoded together
    return res.redirect('/deductions/donations/amount')
  }

  req.session.deductions.charitableDonationClaim = false

  next()
}
//End of Charitable Donations controller functions

//Start of Medical claim controller functions
const postMedical = (req, res, next) => {
  const medicalClaim = req.body.medicalClaim

  if (medicalClaim === 'Yes') {
    req.session.deductions.medicalExpenseClaim = true

    // These two pages are hardcoded together
    return res.redirect('/deductions/medical/amount')
  }

  req.session.deductions.medicalExpenseClaim = false

  next()
}
//End of Medical claim controller functions

//Start of Political controller functions
const postPolitical = (req, res, next) => {
  const politicalClaim = req.body.politicalClaim

  if (politicalClaim === 'Yes') {
    req.session.deductions.politicalClaim = true

    // These two pages are hardcoded together
    return res.redirect('/deductions/political/amount')
  }

  req.session.deductions.politicalClaim = false

  next()
}
//End of Political controller functions
