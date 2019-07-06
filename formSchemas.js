const API = require('./api')

const loginSchema = {
  code: {
    isLength: {
      errorMessage: 'Must be 8 characters',
      options: { min: 8, max: 8 },
    },
    isAlphanumeric: {
      errorMessage: 'Code can only contain letters and numbers',
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
