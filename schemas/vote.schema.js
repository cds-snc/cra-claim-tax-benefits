const { yesNoSchema } = require('./utils.schema')

const optInSchema = {
  confirmOptIn: yesNoSchema(),
}

module.exports = {
  optInSchema
}