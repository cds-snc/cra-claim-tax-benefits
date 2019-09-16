const { currencySchema, yesNoSchema } = require('./utils.schema')

const rrspSchema = {
  rrspClaim: yesNoSchema(),
}

const rrspAmountSchema = {
  rrspAmount: currencySchema(),
}

const donationsSchema = {
  donationsClaim: yesNoSchema(),
}

const donationsAmountSchema = {
  donationsAmount: currencySchema(),
}

const politicalSchema = {
  politicalClaim: yesNoSchema(),
}

const politicalAmountSchema = {
  politicalProvincialAmount: currencySchema(),
  politicalFederalAmount: currencySchema(),
}

const medicalSchema = {
  medicalClaim: yesNoSchema(),
}

const medicalAmountSchema = {
  medicalAmount: currencySchema(),
}

const trilliumRentSchema = {
  trilliumRentClaim: yesNoSchema(),
}

const trilliumRentAmountSchema = {
  trilliumRentAmount: currencySchema(),
}

const trilliumPropertyTaxAmountSchema = {
  trilliumPropertyTaxAmount: currencySchema(),
}

const trilliumStudentResidenceSchema = {
  trilliumStudentResidence: yesNoSchema(),
}

const trilliumEnergyAmountSchema = {
  trilliumEnergyAmount: currencySchema(),
}

const trilliumlongTermCareAmountSchema = {
  trilliumLongTermCareAmount: currencySchema(),
}

const climateActionIncentiveSchema = {
  climateActionIncentiveIsRural: yesNoSchema(),
}

module.exports = {
  climateActionIncentiveSchema,
  donationsSchema,
  donationsAmountSchema,
  medicalSchema,
  medicalAmountSchema,
  politicalSchema,
  politicalAmountSchema,
  rrspSchema,
  rrspAmountSchema,
  trilliumRentSchema,
  trilliumRentAmountSchema,
  trilliumPropertyTaxAmountSchema,
  trilliumEnergyAmountSchema,
  trilliumlongTermCareAmountSchema,
  trilliumStudentResidenceSchema,
}
