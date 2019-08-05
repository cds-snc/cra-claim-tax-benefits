const { yesNoSchema } = require('./utils.schema')

const incomeSchema = {
  confirmIncome: yesNoSchema(),
}

module.exports = {
  incomeSchema,
}