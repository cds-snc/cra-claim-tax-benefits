const { validationArray } = require('./utils.schema')
const API = require('./../api')

const loginSchema = {
  code: {
    isLength: {
      errorMessage: 'errors.login.length',
      options: { min: 9, max: 9 },
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
    custom: {
      options: (value, { req }) => {
        /* If there is no session, always return true */
        if (!req.session || !req.session.personal) {
          return true
        }

        return value === req.session.personal.sin
      },
      errorMessage: 'errors.login.sin',
    },
  },
}

const currentDate = new Date()

const lastDayInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

const isValidDay = {
  errorMessage: 'errors.login.dateOfBirth.validDay',
  validate: (value, req) => {
    const year = parseInt(req.body.dobYear, 10)
    //subtract one because Date for months starts at a 0 index for Jan 🤓
    const month = parseInt(req.body.dobMonth, 10) - 1
    const day = parseInt(value, 10)

    if (!day || !month || !year) {
      return false
    }

    return day >= 1 && day <= lastDayInMonth(year, month)
  },
}

const isMatchingDoB = {
  errorMessage: 'errors.login.dateOfBirth.match',
  validate: (value, req) => {
    /* If there is no session, always return true */
    if (!req.session || !req.session.personal) {
      return true
    }

    const { dobYear: y, dobMonth: m, dobDay: d } = req.body
    return `${y}-${m}-${d}` === req.session.personal.dateOfBirth
  },
}

const dobSchema = {
  dobDay: {
    ...validationArray([isValidDay, isMatchingDoB]),
  },
  dobMonth: {
    isInt: {
      errorMessage: 'errors.login.dateOfBirth.validMonth',
      options: { min: 1, max: 12 },
    },
  },
  dobYear: {
    isInt: {
      errorMessage: 'errors.login.dateOfBirth.validYear',
      options: { min: currentDate.getFullYear() - 200, max: currentDate.getFullYear() - 1 },
    },
  },
}

module.exports = {
  loginSchema,
  dobSchema,
  sinSchema,
  lastDayInMonth,
}
