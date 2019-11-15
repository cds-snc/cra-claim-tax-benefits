const { yesNoSchema } = require('./utils.schema')

const optInSchema = {
  confirmOptIn: yesNoSchema(),
}

const confirmRegistrationSchema = {
  voterCitizen: {
    isIn: {
      errorMessage: 'errors.voterCitizen',
      options: [['voterCitizen']]
    }
  },
  voterConsent: {
    isIn: {
      errorMessage: 'errors.voterConsent',
      options: [['voterConsent']]
    }
  }
}

module.exports = {
  optInSchema,
  confirmRegistrationSchema
}