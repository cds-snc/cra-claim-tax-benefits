const confirmationSchemas = require('./confirmation.schema')
const deductionsSchemas = require('./deductions.schema')
const financialSchemas = require('./financial.schema')
const loginSchemas = require('./login.schema')
const personalSchemas = require('./personal.schema')

module.exports = {
  ...confirmationSchemas,
  ...deductionsSchemas,
  ...financialSchemas,
  ...loginSchemas,
  ...personalSchemas,
}

