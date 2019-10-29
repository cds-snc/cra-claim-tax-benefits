const { checkSchema } = require('express-validator')
const { doRedirect, doYesNo, renderWithData, checkErrors, returnToCheckAnswers } = require('./../../utils')
const {
  trilliumRentSchema,
  trilliumRentAmountSchema,
  trilliumPropertyTaxSchema,
  trilliumPropertyTaxAmountSchema,
  trilliumStudentResidenceSchema,
  trilliumEnergyReserveSchema,
  trilliumEnergyCostSchema,
  trilliumEnergyAmountSchema,
  trilliumlongTermCareSchema,
  trilliumLongTermCareTypeSchema,
  trilliumlongTermCareAmountSchema,
  climateActionIncentiveSchema,
} = require('./../../schemas')

module.exports = function(app) {
  //Start of Trillum Section

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

  app.get('/trillium/energy/reserve', renderWithData('deductions/trillium-energy-reserve'))
  app.post(
    '/trillium/energy/reserve',
    checkSchema(trilliumEnergyReserveSchema),
    checkErrors('deductions/trillium-energy-reserve'),
    postEnergyReserve,
    doRedirect,
  )

  app.get('/trillium/energy/cost', renderWithData('deductions/trillium-energy-cost'))
  app.post(
    '/trillium/energy/cost',
    checkSchema(trilliumEnergyCostSchema),
    checkErrors('deductions/trillium-energy-cost'),
    doYesNo('trilliumEnergyCostClaim', 'trilliumEnergyAmount'),
    // These only apply if the user clicked "no"
    // If they clicked "Yes", they will be redirected by `doYesNo()`
    (req, res, next) => {
      req.session.deductions.trilliumEnergyAmount = 0
      next()
    },
    doRedirect,
  )

  app.get('/trillium/energy/cost/amount', renderWithData('deductions/trillium-energy-cost-amount'))
  app.post(
    '/trillium/energy/cost/amount',
    checkSchema(trilliumEnergyAmountSchema),
    checkErrors('deductions/trillium-energy-cost-amount'),
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
    postLongTermCare,
    doRedirect,
  )

  app.get('/trillium/longTermCare/type', renderWithData('deductions/trillium-longTermCare-type'))
  app.post(
    '/trillium/longTermCare/type',
    checkSchema(trilliumLongTermCareTypeSchema),
    checkErrors('deductions/trillium-longTermCare-type'),
    doYesNo('trilliumLongTermCareTypeClaim', 'trilliumLongTermCareAmount'),
    // These only apply if the user clicked "no"
    // If they clicked "Yes", they will be redirected by `doYesNo()`
    (req, res, next) => {
      req.session.deductions.trilliumLongTermCareAmount = 0
      next()
    },
    doRedirect,
  )

  app.get(
    '/trillium/longTermCare/type/amount',
    renderWithData('deductions/trillium-longTermCare-amount'),
  )
  app.post(
    '/trillium/longTermCare/type/amount',
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

const postEnergyReserve = (req, res, next) => {
  const trilliumEnergyReserveClaim = req.body.trilliumEnergyReserveClaim

  req.session.deductions.trilliumEnergyReserveClaim = trilliumEnergyReserveClaim

  if (trilliumEnergyReserveClaim !== 'Yes') {

    req.session.deductions.trilliumEnergyCostClaim = null
    req.session.deductions.trilliumEnergyAmount = 0

    if (req.query.ref && req.query.ref === 'checkAnswers') {
      return returnToCheckAnswers(req, res)
    }

    return res.redirect('/trillium/longTermCare')
  }

  if (req.query.ref && req.query.ref === 'checkAnswers') {
    return returnToCheckAnswers(req, res, true)
  }

  next()
}

const postLongTermCare = (req, res, next) => {
  const trilliumLongTermCareClaim = req.body.trilliumLongTermCareClaim

  req.session.deductions.trilliumLongTermCareClaim = trilliumLongTermCareClaim

  if (trilliumLongTermCareClaim !== 'Yes') {

    req.session.deductions.trilliumLongTermCareTypeClaim = null
    req.session.deductions.trilliumLongTermCareAmount = 0

    if (req.query.ref && req.query.ref === 'checkAnswers') {
      return returnToCheckAnswers(req, res)
    }

    return res.redirect('/deductions/climate-action-incentive')
  }

  if (req.query.ref && req.query.ref === 'checkAnswers') {
    return returnToCheckAnswers(req, res, true)
  }

  next()
}
