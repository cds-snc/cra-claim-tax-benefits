const { checkSchema } = require('express-validator')
const { doRedirect, doYesNo, renderWithData, checkErrors } = require('./../../utils')
const {
  rrspSchema,
  rrspAmountSchema,
  charitableDonationSchema,
  donationsAmountSchema,
  politicalContributionSchema,
  politicalAmountSchema,
  medicalExpenseSchema,
  medicalAmountSchema,
  trilliumRentSchema,
  trilliumRentAmountSchema,
  trilliumPropertyTaxSchema,
  trilliumPropertyTaxAmountSchema,
  trilliumStudentResidenceSchema,
  trilliumEnergySchema,
  trilliumEnergyAmountSchema,
  trilliumlongTermCareSchema,
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
    doYesNo('rrspClaim', 'rrspAmount'),
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
    checkSchema(charitableDonationSchema),
    checkErrors('deductions/donations'),
    doYesNo('charitableDonationClaim', 'charitableDonationAmount'),
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
    checkSchema(medicalExpenseSchema),
    checkErrors('deductions/medical'),
    doYesNo('medicalExpenseClaim', 'medicalExpenseClaimAmount'),
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
    checkSchema(politicalContributionSchema),
    checkErrors('deductions/political'),
    doYesNo('politicalContributionClaim'),
    // These only apply if the user clicked "no"
    // If they clicked "Yes", they will be redirected by `doYesNo()`
    (req, res, next) => {
      req.session.deductions.politicalFederalAmount = 0
      req.session.deductions.politicalProvincialAmount = 0
      next()
    },
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

  app.get('/trillium/start', renderWithData('deductions/trillium-start'))

  app.get('/trillium/rent', renderWithData('deductions/trillium-rent'))
  app.post(
    '/trillium/rent',
    checkSchema(trilliumRentSchema),
    checkErrors('deductions/trillium-rent'),
    doYesNo('trilliumRentClaim', 'trilliumRentAmount'),
    doRedirect,
  )
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

  app.get('/trillium/propertyTax', renderWithData('deductions/trillium-propertyTax'))
  app.post(
    '/trillium/propertyTax',
    checkSchema(trilliumPropertyTaxSchema),
    checkErrors('deductions/trillium-propertyTax'),
    doYesNo('trilliumPropertyTaxClaim', 'trilliumPropertyTaxAmount'),
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

  app.get('/trillium/energy', renderWithData('deductions/trillium-energy'))
  app.post(
    '/trillium/energy',
    checkSchema(trilliumEnergySchema),
    checkErrors('deductions/trillium-energy'),
    doYesNo('trilliumEnergyClaim', 'trilliumEnergyAmount'),
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

  app.get('/trillium/longTermCare', renderWithData('deductions/trillium-longTermCare'))
  app.post(
    '/trillium/longTermCare',
    checkSchema(trilliumlongTermCareSchema),
    checkErrors('deductions/trillium-longTermCare'),
    doYesNo('trilliumLongTermCareClaim', 'trilliumLongTermCareAmount'),
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
