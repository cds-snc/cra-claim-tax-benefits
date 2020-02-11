const { yesNoSchema } = require('./utils.schema')

const optInSchema = {
  confirmOptIn: yesNoSchema(),
}

const citizenSchema = {
  citizen: yesNoSchema(),
}

const registerSchema = {
  register: yesNoSchema(),
}

module.exports = {
  optInSchema,
  citizenSchema,
  registerSchema,
}
