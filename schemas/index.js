const confirmationSchemas = require('./confirmation.schema')
const deductionsSchemas = require('./deductions.schema')
const loginSchemas = require('./login.schema')
const personalSchemas = require('./personal.schema')
const votingSchemas = require('./vote.schema')

module.exports = {
  ...confirmationSchemas,
  ...deductionsSchemas,
  ...loginSchemas,
  ...personalSchemas,
  ...votingSchemas,
}
