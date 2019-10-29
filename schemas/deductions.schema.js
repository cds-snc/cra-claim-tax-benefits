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

const trilliumPropertyTaxAmountSchema = {
  trilliumPropertyTaxAmount: currencySchema(),
}

const trilliumStudentResidenceSchema = {
  trilliumStudentResidence: yesNoSchema(),
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
  trilliumPropertyTaxAmountSchema,
  trilliumEnergyReserveSchema,
  trilliumEnergyCostSchema,
  trilliumEnergyAmountSchema,
  trilliumlongTermCareSchema,
  trilliumLongTermCareTypeSchema,
  trilliumlongTermCareAmountSchema,
  trilliumStudentResidenceSchema,
}
