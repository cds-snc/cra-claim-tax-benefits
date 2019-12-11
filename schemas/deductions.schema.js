const { currencySchema, yesNoSchema } = require('./utils.schema')

const trilliumRentSchema = {
  trilliumRentClaim: yesNoSchema(),
}

const trilliumRentOntarioSchema = {
  trilliumRentOntario: yesNoSchema(),
}

const trilliumRentAmountSchema = {
  trilliumRentAmount: currencySchema(),
}

const trilliumPropertyTaxSchema = {
  trilliumPropertyTaxClaim: yesNoSchema(),
}

const trilliumPropertyTaxOntarioSchema = {
  trilliumPropertyTaxOntario: yesNoSchema(),
}

const trilliumPropertyTaxAmountSchema = {
  trilliumPropertyTaxAmount: currencySchema(),
}

const trilliumEnergyReserveSchema = {
  trilliumEnergyReserveClaim: yesNoSchema(),
}

const trilliumEnergyReserveOntarioSchema = {
  trilliumEnergyReserveOntario: yesNoSchema(),
}

const trilliumEnergyCostSchema = {
  trilliumEnergyCostClaim: yesNoSchema(),
}

const trilliumEnergyAmountSchema = {
  trilliumEnergyAmount: currencySchema(),
}

const trilliumlongTermCareSchema = {
  trilliumLongTermCareClaim: yesNoSchema(),
}

const trilliumlongTermCareOntarioSchema = {
  trilliumLongTermCareOntario: yesNoSchema(),
}

const trilliumlongTermCareTypeSchema = {
  trilliumLongTermCareTypeClaim: yesNoSchema(),
}

const trilliumlongTermCareCostSchema = {
  trilliumLongTermCareCost: yesNoSchema(),
}

const trilliumlongTermCareRoomAndBoardSchema = {
  trilliumLongTermCareRoomAndBoardAmount: currencySchema(),
}

const trilliumlongTermCareAmountSchema = {
  trilliumLongTermCareAmount: currencySchema(),
}

const climateActionIncentiveSchema = {
  climateActionIncentiveIsRural: yesNoSchema(),
}

module.exports = {
  climateActionIncentiveSchema,
  trilliumRentSchema,
  trilliumRentOntarioSchema,
  trilliumRentAmountSchema,
  trilliumPropertyTaxSchema,
  trilliumPropertyTaxOntarioSchema,
  trilliumPropertyTaxAmountSchema,
  trilliumEnergyReserveSchema,
  trilliumEnergyReserveOntarioSchema,
  trilliumEnergyCostSchema,
  trilliumEnergyAmountSchema,
  trilliumlongTermCareSchema,
  trilliumlongTermCareOntarioSchema,
  trilliumlongTermCareTypeSchema,
  trilliumlongTermCareCostSchema,
  trilliumlongTermCareRoomAndBoardSchema,
  trilliumlongTermCareAmountSchema,
}
