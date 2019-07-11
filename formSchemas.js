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

const sinSchema = {
  sin: {
    customSanitizer: {
      options: value => {
        //We want to remove any spaces, dash or underscores
        return value ? value.replace(/[ \-_]*/g, '') : value
      },
    },
    isLength: {
      errorMessage: 'errors.login.lengthSIN',
      options: { min: 9, max: 9 },
    },
    isInt: {
      errorMessage: 'errors.login.numericSIN',
    },
  },
}

//TODO: We'll want to store this array of marital options somewhere. This is temporary. I'll also want to use that later to create the radio buttons dynamically, to avoid having to update multiple files
const maritalStatusSchema = {
  maritalStatus: {
    isIn: {
      errorMessage: 'errors.maritalStatus.maritalStatus',
      options: [['Married', 'Widowed', 'Divorced', 'Separated', 'Single']],
    },
  },
}

module.exports = {
  loginSchema,
  maritalStatusSchema,
  sinSchema,
}
