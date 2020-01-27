const { checkSchema } = require('express-validator')

const {
  doRedirect,
  doYesNo,
  clearSessionFields,
  getNextRoute,
  renderWithData,
  checkErrors,
  postAmount,
  is65,
} = require('./../../utils')
const {
  trilliumRentSchema,
  trilliumRentOntarioSchema,
  trilliumRentAmountSchema,
  trilliumPropertyTaxSchema,
  trilliumPropertyTaxOntarioSchema,
  trilliumPropertyTaxAmountSchema,
  trilliumEnergyReserveSchema,
  trilliumEnergyReserveOntarioSchema,
  trilliumEnergyCostSchema,
  seniorTransitSchema,
  seniorTransitAmountSchema,
  trilliumEnergyAmountSchema,
  trilliumlongTermCareSchema,
  trilliumlongTermCareOntarioSchema,
  trilliumlongTermCareTypeSchema,
  trilliumlongTermCareCostSchema,
  trilliumlongTermCareRoomAndBoardSchema,
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
    doYesNo('trilliumRentClaim', ['trilliumRentOntario', 'trilliumRentAmount']),
    doRedirect,
  )
  app.get('/trillium/rent/ontario', renderWithData('deductions/trillium-rent-ontario'))
  app.post(
    '/trillium/rent/ontario',
    checkSchema(trilliumRentOntarioSchema),
    checkErrors('deductions/trillium-rent-ontario'),
    doYesNo('trilliumRentOntario', ['trilliumRentAmount']),
    doRedirect,
  )
  app.get('/trillium/rent/amount', renderWithData('deductions/trillium-rent-amount'))
  app.post(
    '/trillium/rent/amount',
    checkSchema(trilliumRentAmountSchema),
    checkErrors('deductions/trillium-rent-amount'),
    (req, res, next) => {
      req.session.deductions.trilliumRentAmount = postAmount(
        req.body.trilliumRentAmount,
        req.locale,
      )
      next()
    },
    doRedirect,
  )

  app.get('/trillium/propertyTax', renderWithData('deductions/trillium-propertyTax'))
  app.post(
    '/trillium/propertyTax',
    checkSchema(trilliumPropertyTaxSchema),
    checkErrors('deductions/trillium-propertyTax'),
    doYesNo('trilliumPropertyTaxClaim', ['trilliumPropertyTaxOntario']),
    doRedirect,
  )
  app.get(
    '/trillium/propertyTax/ontario',
    renderWithData('deductions/trillium-propertyTax-ontario'),
  )
  app.post(
    '/trillium/propertyTax/ontario',
    checkSchema(trilliumPropertyTaxOntarioSchema),
    checkErrors('deductions/trillium-propertyTax-ontario'),
    doYesNo('trilliumPropertyTaxOntario', ['trilliumPropertyTaxAmount']),
    doRedirect,
  )
  app.get('/trillium/propertyTax/amount', renderWithData('deductions/trillium-propertyTax-amount'))
  app.post(
    '/trillium/propertyTax/amount',
    checkSchema(trilliumPropertyTaxAmountSchema),
    checkErrors('deductions/trillium-propertyTax-amount'),
    (req, res, next) => {
      req.session.deductions.trilliumPropertyTaxAmount = postAmount(
        req.body.trilliumPropertyTaxAmount,
        req.locale,
      )
      next()
    },
    doRedirect,
  )

  app.get('/trillium/energy/reserve', renderWithData('deductions/trillium-energy-reserve'))
  app.post(
    '/trillium/energy/reserve',
    checkSchema(trilliumEnergyReserveSchema),
    checkErrors('deductions/trillium-energy-reserve'),
    doYesNo('trilliumEnergyReserveClaim', ['trilliumEnergyCostClaim', 'trilliumEnergyAmount']),
    doRedirect,
  )
  app.get(
    '/trillium/energy/reserve/ontario',
    renderWithData('deductions/trillium-energy-reserve-ontario'),
  )
  app.post(
    '/trillium/energy/reserve/ontario',
    checkSchema(trilliumEnergyReserveOntarioSchema),
    checkErrors('deductions/trillium-energy-reserve-ontario'),
    doYesNo('trilliumEnergyReserveOntario', ['trilliumEnergyAmount']),
    doRedirect,
  )

  app.get('/trillium/energy/cost', renderWithData('deductions/trillium-energy-cost'))
  app.post(
    '/trillium/energy/cost',
    checkSchema(trilliumEnergyCostSchema),
    checkErrors('deductions/trillium-energy-cost'),
    doYesNo('trilliumEnergyCostClaim', ['trilliumEnergyAmount']),
    doRedirect,
  )

  app.get('/trillium/energy/cost/amount', renderWithData('deductions/trillium-energy-cost-amount'))
  app.post(
    '/trillium/energy/cost/amount',
    checkSchema(trilliumEnergyAmountSchema),
    checkErrors('deductions/trillium-energy-cost-amount'),
    (req, res, next) => {
      req.session.deductions.trilliumEnergyAmount = postAmount(
        req.body.trilliumEnergyAmount,
        req.locale,
      )
      next()
    },
    doRedirect,
  )

  app.get(
    '/deductions/senior-public-transit',
    seniorRedirect,
    renderWithData('deductions/senior-public-transit'),
  )

  app.post(
    '/deductions/senior-public-transit',
    seniorRedirect,
    checkSchema(seniorTransitSchema),
    checkErrors('deductions/senior-public-transit'),
    doYesNo('seniorTransitClaim', ['seniorTransitAmount']),
    doRedirect,
  )

  app.get(
    '/deductions/senior-public-transit/amount',
    seniorRedirect,
    renderWithData('deductions/senior-public-transit-amount'),
  )
  app.post(
    '/deductions/senior-public-transit/amount',
    seniorRedirect,
    checkSchema(seniorTransitAmountSchema),
    checkErrors('deductions/senior-public-transit-amount'),
    (req, res, next) => {
      req.session.deductions.seniorTransitAmount = postAmount(
        req.body.seniorTransitAmount,
        req.locale,
      )
      next()
    },
    doRedirect,
  )

  app.get('/trillium/longTermCare', renderWithData('deductions/trillium-longTermCare'))
  app.post(
    '/trillium/longTermCare',
    checkSchema(trilliumlongTermCareSchema),
    checkErrors('deductions/trillium-longTermCare'),
    doYesNo('trilliumLongTermCareClaim', [
      'trilliumLongTermCareTypeClaim',
      'trilliumLongTermCareAmount',
    ]),
    doRedirect,
  )

  app.get(
    '/trillium/longTermCare/ontario',
    renderWithData('deductions/trillium-longTermCare-ontario'),
  )
  app.post(
    '/trillium/longTermCare/ontario',
    checkSchema(trilliumlongTermCareOntarioSchema),
    checkErrors('deductions/trillium-longTermCare-ontario'),
    doYesNo('trilliumLongTermCareOntario', [
      'trilliumLongTermCareTypeOntario',
      'trilliumLongTermCareAmount',
    ]),
    doRedirect,
  )

  app.get('/trillium/longTermCare/type', renderWithData('deductions/trillium-longTermCare-type'))
  app.post(
    '/trillium/longTermCare/type',
    checkSchema(trilliumlongTermCareTypeSchema),
    checkErrors('deductions/trillium-longTermCare-type'),
    doYesNo('trilliumLongTermCareTypeClaim', ['trilliumLongTermCareAmount']),
    doRedirect,
  )

  app.get('/trillium/longTermCare/cost', renderWithData('deductions/trillium-longTermCare-cost'))
  app.post(
    '/trillium/longTermCare/cost',
    checkSchema(trilliumlongTermCareCostSchema),
    checkErrors('deductions/trillium-longTermCare-cost'),
    (req, res, next) => {
      // modified doYesNo code to account for 'Yes' branch
      const claim = 'trilliumLongTermCareCost'
      const fields = [
        'trilliumLongTermCareRoomAndBoardAmount',
        'trilliumLongTermCareAmount',
        'trilliumLongTermCareAmountIsFull',
      ]
      // set the value in the session
      req.session.deductions[claim] = req.body[claim] === 'Yes' ? true : false

      // clear associated fields regardless of yes / no answer
      clearSessionFields(req, fields)

      // if yes still need to redirect to the proper page
      if (req.body[claim] === 'Yes') {
        return res.redirect(getNextRoute(req).path)
      }

      next()
    },
    doRedirect,
  )

  app.get(
    '/trillium/longTermCare/type/roomAndBoard',
    renderWithData('deductions/trillium-longTermCare-roomAndBoard'),
  )
  app.post(
    '/trillium/longTermCare/type/roomAndBoard',
    checkSchema(trilliumlongTermCareRoomAndBoardSchema),
    checkErrors('deductions/trillium-longTermCare-roomAndBoard'),
    (req, res, next) => {
      req.session.deductions.trilliumLongTermCareRoomAndBoardAmount = postAmount(
        req.body.trilliumLongTermCareRoomAndBoardAmount,
        req.locale,
      )
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
      req.session.deductions.trilliumLongTermCareAmountIsFull = true
      req.session.deductions.trilliumLongTermCareAmount = postAmount(
        req.body.trilliumLongTermCareAmount,
        req.locale,
      )
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
      req.session.deductions.climateActionIncentiveIsRural =
        req.body.climateActionIncentiveIsRural === 'Yes' ? true : false
      next()
    },
    doRedirect,
  )
}

// Only skip this page in production. For testing and development, we want to be able to see the senior transit pages just like any other.
const seniorRedirect = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // if under 65, skip this page
    if (!is65(req.session.personal.dateOfBirth)) {
      return res.redirect('/trillium/rent')
    }
  }
  return next()
}
