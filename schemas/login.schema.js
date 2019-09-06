const { currencySchema, validationArray } = require('./utils.schema')
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

const lastDayInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

const validBirthDateLengths = {
  errorMessage: 'errors.login.dateOfBirth.format',
  validate: value => {
    if (!value) {
      return false
    }

    const birthDateSplit = value.split('/')

    if (birthDateSplit.length !== 3) {
      return false
    }

    return (
      birthDateSplit[0].length === 4 &&
      birthDateSplit[1].length === 2 &&
      birthDateSplit[2].length === 2
    )
  },
}

const validBirthDateChars = {
  errorMessage: 'errors.login.dateOfBirth.characters',
  validate: value => {
    const numAndSlash = new RegExp(/^[0-9/]*$/)
    return numAndSlash.test(value)
  },
}

const validMonth = {
  errorMessage: 'errors.login.dateOfBirth.validMonth',
  validate: value => {
    if (!value) {
      return false
    }

    //month is not less than 1 or greater than 12
    const month = parseInt(value.split('/')[1], 10)
    return month >= 1 && month <= 12
  },
}

const validDay = {
  errorMessage: 'errors.login.dateOfBirth.validDay',
  validate: value => {
    if (!value) {
      return false
    }

    //day is within the acceptable range
    const dateSplit = value.split('/')
    //subtract one because Date for months starts at a 0 index for Jan
    const month = parseInt(dateSplit[1]) - 1
    const day = parseInt(dateSplit[2], 10)
    const lastDay = lastDayInMonth(dateSplit[0], month)
    return day >= 1 && day <= lastDay
  },
}

const validYear = {
  errorMessage: 'errors.login.dateOfBirth.validYear',
  validate: value => {
    //year is within the acceptable range. Person not older than 200, not younger than 1
    //listen, if you've lived to 201, why are you even bothering with taxes?
    const dateEntered = new Date(value)
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const day = currentDate.getDate()

    const lastYear = new Date(year - 1, month, day)

    const longAgo = new Date(year - 200, month, day)

    return dateEntered <= lastYear && dateEntered >= longAgo
  },
}

const matchingDoB = {
  errorMessage: 'errors.login.dateOfBirth.match',
  validate: (value, req) => {
    /* If there is no session, always return true */
    if (!req.session || !req.session.personal) {
      return true
    }

    return value === req.session.personal.dateOfBirth
  },
}

const birthSchema = {
  dateOfBirth: {
    //pro-tip: the order of the sanitizers does matter
    customSanitizer: {
      options: value => {
        //We want to remove any spaces, dash or underscores
        return value ? value.replace(/[ \-_]*/g, '') : value
      },
    },
    ...validationArray([
      validBirthDateLengths,
      validBirthDateChars,
      validMonth,
      validDay,
      validYear,
      matchingDoB,
    ]),
    isLength: {
      errorMessage: 'errors.login.dateOfBirth',
      //length with slashes
      options: { min: 10, max: 10 },
    },
  },
}

const currentDate = new Date()

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

const authSchema = {
  auth: currencySchema(),
}

module.exports = {
  authSchema,
  birthSchema,
  loginSchema,
  dobSchema,
  sinSchema,
}
