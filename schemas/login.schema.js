const validator = require('validator')
const SocialInsuranceNumber = require('social-insurance-number')
const { monthSchema, yearSchema, yesNoSchema } = require('./utils.schema')

const loginSchema = {
  code: {
    isLength: {
      errorMessage: 'errors.login.length',
      options: { min: 9, max: 9 },
    },
    isAlphanumeric: {
      errorMessage: 'errors.login.alphanumeric',
    },
  },
}

let sinError = 'errors.login.missingSIN'
const _getSinErrorMessage = val => {
  if (!val) {
    return 'errors.login.missingSIN'
  }

  // remove spaces, hyphens and underscores
  const digits = val.replace(/[ \-_]*/g, '')

  if (!validator.isNumeric(digits)) {
    return 'errors.login.numericSIN'
  }

  if (digits.length !== 9) {
    return 'errors.login.lengthSIN'
  }
  let sin = new SocialInsuranceNumber(val)

  if (! sin.isValid()) {
    return 'errors.login.invalidSIN'
  }

  return false
}

const sinSchema = {
  sin: {
    custom: {
      options: value => {
        const errorMessage = _getSinErrorMessage(value)
        if (errorMessage) sinError = errorMessage

        /* if an error message exists, we failed validation */
        return !errorMessage
      },
      errorMessage: () => sinError,
    },
  },
}

const isValidDay = (errorMessageString = 'errors.login.dateOfBirth.validDay') => {
  return {
    isInt: {
      errorMessage: errorMessageString,
      options: { min: 1, max: 31 },
    },
  }
}

const _toISOFormat = ({ dobYear, dobMonth, dobDay }) => {
  const if0 = val => (val && val.length === 1 ? `0${val}` : val)

  return `${dobYear}-${if0(dobMonth)}-${if0(dobDay)}`
}

const dobSchema = {
  dobDay: {
    ...isValidDay(),
  },
  dobMonth: monthSchema(),
  dobYear: yearSchema(),
}

const ageSchema = {
  ageYesNo: yesNoSchema(),
}

const taxableIncomeSchema = {
  taxableIncome: yesNoSchema(),
}

const residenceScreeningSchema = {
  residenceScreening: yesNoSchema(),
}

const childrenSchema = {
  children: yesNoSchema(),
}

const eligibleDependentsSchema = {
  eligibleDependents: yesNoSchema(),
}

const eligibleDependentsClaimSchema = {
  eligibleDependentsClaim: yesNoSchema(),
}

const tuitionSchema = {
  tuition: yesNoSchema(),
}

const tuitionClaimSchema = {
  tuitionClaim: yesNoSchema(),
}

const incomeSourcesSchema = {
  incomeSources: yesNoSchema(),
}

const foreignIncomeSchema = {
  foreignIncome: yesNoSchema(),
}

module.exports = {
  loginSchema,
  dobSchema,
  sinSchema,
  _toISOFormat,
  _getSinErrorMessage,
  eligibleDependentsSchema,
  eligibleDependentsClaimSchema,
  tuitionSchema,
  tuitionClaimSchema,
  incomeSourcesSchema,
  foreignIncomeSchema,
  taxableIncomeSchema,
  residenceScreeningSchema,
  ageSchema,
  childrenSchema,
}
