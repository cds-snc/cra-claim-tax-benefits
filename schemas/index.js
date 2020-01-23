const deductionsSchemas = require('./deductions.schema')
const loginSchemas = require('./login.schema')
const personalSchemas = require('./personal.schema')
const votingSchemas = require('./vote.schema')

module.exports = {
  ...deductionsSchemas,
  ...loginSchemas,
  ...personalSchemas,
  ...votingSchemas,
}
