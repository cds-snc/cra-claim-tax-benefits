const { yesNoSchema } = require('./utils.schema')

const optInSchema = {
  confirmOptIn: yesNoSchema(),
}

const confirmRegistrationSchema = {
  voterCitizen: {
    isIn: {
      errorMessage: 'errors.voterCitizen',
      options: [[null, 'voterCitizen']],
    },
  },
  voterConsent: {
    isIn: {
      errorMessage: 'errors.voterConsent',
      options: [[null, 'voterConsent']],
    },
  },
}

module.exports = {
  optInSchema,
  confirmRegistrationSchema,
}
