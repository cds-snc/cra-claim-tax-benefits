const { currencySchema, yesNoSchema } = require('./utils.schema')

const trilliumRentSchema = {
  trilliumRentClaim: yesNoSchema(),
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

const trilliumEnergyCostSchema = {
  trilliumEnergyCostClaim: yesNoSchema(),
}

const trilliumEnergyAmountSchema = {
  trilliumEnergyAmount: currencySchema(),
}

const trilliumlongTermCareSchema = {
  trilliumLongTermCareClaim: yesNoSchema(),
}

const trilliumLongTermCareTypeSchema = {
  trilliumLongTermCareTypeClaim: yesNoSchema(),
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
  trilliumRentAmountSchema,
  trilliumPropertyTaxSchema,
  trilliumPropertyTaxOntarioSchema,
  trilliumPropertyTaxAmountSchema,
  trilliumEnergyReserveSchema,
  trilliumEnergyCostSchema,
  trilliumEnergyAmountSchema,
  trilliumlongTermCareSchema,
  trilliumLongTermCareTypeSchema,
  trilliumlongTermCareAmountSchema,
}
