const { yesNoSchema } = require('./utils.schema')

const maritalStatusSchema = {
  confirmMaritalStatus: yesNoSchema(),
}

const addressSchema = {
  confirmAddress: yesNoSchema(),
}

const nameSchema = {
  name: yesNoSchema(),
}

module.exports = {
  addressSchema,
  maritalStatusSchema,
  nameSchema,
}
