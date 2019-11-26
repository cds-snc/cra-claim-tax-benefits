const validator = require('validator')
const { currencySchema, yesNoSchema, monthSchema, yearSchema } = require('./utils.schema')
const API = require('./../api')
const { securityQuestionUrls } = require('../config/routes.config')

const loginSchema = {
  code: {
    isLength: {
      errorMessage: 'errors.login.length',
      options: { min: 9, max: 9 },
    },
    isAlphanumeric: {
      errorMessage: 'errors.login.alphanumeric',
    },
    isIn: {
      options: [API.getMatches()],
      errorMessage: 'errors.login.code',
    },
  },
}

let sinError = 'errors.login.lengthSIN'
const _getSinErrorMessage = val => {
  if (!val) {
    // technically, 0 characters is the wrong length
    return 'errors.login.lengthSIN'
  }

  // remove spaces, hyphens and underscores
  const digits = val.replace(/[ \-_]*/g, '')

  if (!validator.isNumeric(digits)) {
    return 'errors.login.numericSIN'
  }

  if (digits.length !== 9) {
    return 'errors.login.lengthSIN'
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

const noticeSchema = {
  noticeOfAssessment: yesNoSchema(),
}

const securityQuestionSchema = {
  securityQuestion: {
    isIn: {
      errorMessage: 'errors.yesNo',
      options: [securityQuestionUrls],
    },
  },
}

const childSchema = {
  childLastName: {
    isEmpty: {
      errorMessage: 'errors.login.childLastName',
      negated: true,
    },
  },
  dobDay: isValidDay(),
  dobMonth: monthSchema(),
  dobYear: yearSchema(),
}

const dateOfResidenceSchema = {
  dobDay: isValidDay(),
  dobMonth: monthSchema(),
  dobYear: yearSchema(),
}

const bankruptcySchema = {
  dobDay: isValidDay(),
  dobMonth: monthSchema(),
  dobYear: yearSchema(),
  trusteeLastName: {
    isEmpty: {
      errorMessage: 'errors.login.trusteeLastName',
      negated: true,
    },
  },
}

const _isEmpty = errorMessage => {
  return {
    isEmpty: {
      errorMessage,
      negated: true,
    },
  }
}

const _customPostalCodeFormat = errorMessage => {
  return {
    custom: {
      options: value => {
        // Source: https://gist.github.com/nery/9118763
        var postalCodeRegex = new RegExp(
          /^\s*[a-ceghj-npr-tvxy]\d[a-ceghj-npr-tv-z][-(\s)]?\d[a-ceghj-npr-tv-z]\d\s*$/i,
        )
        return postalCodeRegex.test(value)
      },
      errorMessage,
    },
  }
}

const _isInProvinces = errorMessage => {
  return {
    isIn: {
      errorMessage,
      options: [
        [
          'Alberta',
          'British Columbia',
          'Manitoba',
          'New Brunswick',
          'Newfoundland And Labrador',
          'Northwest Territories',
          'Nova Scotia',
          'Nunavut',
          'Ontario',
          'Prince Edward Island',
          'Quebec',
          'Saskatchewan',
          'Yukon',
        ],
      ],
    },
  }
}

const addressesSchema = {
  // fields for first address
  firstStreetAddress: _isEmpty('errors.address.streetAddress.empty'),
  firstCity: _isEmpty('errors.address.city.empty'),
  firstPostalCode: {
    ..._isEmpty('errors.address.postalCode.empty'),
    ..._customPostalCodeFormat('errors.address.postalCode.format'),
  },
  firstProvince: _isInProvinces('errors.address.province'),

  // fields for second address
  secondStreetAddress: _isEmpty('errors.address.streetAddress.empty'),
  secondCity: _isEmpty('errors.address.city.empty'),
  secondPostalCode: {
    ..._isEmpty('errors.address.postalCode.empty'),
    ..._customPostalCodeFormat('errors.address.postalCode.format'),
  },
  secondProvince: _isInProvinces('errors.address.province'),
}

const prisonSchema = {
  prisonDate: {
    isIn: {
      errorMessage: 'errors.login.prisonDate',
      options: [['entry', 'release']],
    },
  },
  dobDay: isValidDay(),
  dobMonth: monthSchema(),
  dobYear: yearSchema(),
}

const bankSchema = {
  branchNumber: {
    isLength: {
      errorMessage: 'errors.login.bank.branchLength',
      options: { min: 5, max: 5 },
    },
    isInt: {
      errorMessage: 'errors.login.bank.validBranch',
      options: { min: 1, max: 99999 },
    },
  },
  institutionNumber: {
    isLength: {
      errorMessage: 'errors.login.bank.institutionLength',
      options: { min: 3, max: 3 },
    },
    isInt: {
      errorMessage: 'errors.login.bank.validInstitution',
      options: { min: 1, max: 999 },
    },
  },
  accountNumber: {
    isLength: {
      errorMessage: 'errors.login.bank.accountLength',
      options: { min: 12, max: 12 },
    },
    isInt: {
      errorMessage: 'errors.login.bank.validAccount',
      options: { min: 1, max: 999999999999 },
    },
  },
}

const taxReturnSchema = {
  taxReturnYear: yearSchema('errors.login.taxReturn.validYear'),
  taxReturnAmount: currencySchema('errors.currency', { allowEmpty: false }),
}

const rrspSchema = {
  rrspYear: yearSchema('errors.login.taxReturn.validYear'),
  rrspAmount: currencySchema('errors.currency', { allowEmpty: false }),
}

const tfsaSchema = {
  tfsaYear: yearSchema('errors.login.taxReturn.validYear'),
  tfsaAmount: currencySchema('errors.currency', { allowEmpty: false }),
}

const ccbSchema = {
  ccbYear: yearSchema('errors.login.taxReturn.validYear'),
  ccbAmount: currencySchema('errors.currency', { allowEmpty: false }),
}

module.exports = {
  loginSchema,
  dobSchema,
  sinSchema,
  noticeSchema,
  securityQuestionSchema,
  childSchema,
  dateOfResidenceSchema,
  bankruptcySchema,
  addressesSchema,
  prisonSchema,
  bankSchema,
  taxReturnSchema,
  rrspSchema,
  tfsaSchema,
  ccbSchema,
  _toISOFormat,
  _getSinErrorMessage,
}
