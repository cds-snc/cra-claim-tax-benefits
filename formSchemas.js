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
        return value.toUpperCase()
      },
    },
    isIn: {
      options: [API.getMatches()],
      errorMessage: 'errors.login.code',
    },
  },
}

module.exports = {
  loginSchema,
}
