const API = require('./api')

const loginSchema = {
  code: {
    isLength: {
      errorMessage: 'errors.login.length',
      options: { min: 8, max: 8 },
    },
    isAlphanumeric: {
      errorMessage: 'errors.login.alphanumeric',
    },
    customSanitizer: {
      options: value => {
        return value ? value.toUpperCase() : value
      },
    },
    isIn: {
      options: [API.getMatches()],
      errorMessage: 'errors.login.code',
    },
  },
}

const maritalStatusSchema = {
  maritalStatus: {
    isLength: {
      errorMessage: 'errors.maritalStatus.maritalStatus',
      options: { min: 1 }
    }
  }
}

module.exports = {
  loginSchema,
  maritalStatusSchema
}
