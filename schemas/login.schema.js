const validator = require('validator')
const { currencySchema, validationArray } = require('./utils.schema')
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
  },
}

let sinError = 'errors.login.matchingSIN'
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
      options: (value, { req }) => {
        /* If there is no session, always return false */
        if (!req.session || !req.session.personal) {
          return false
        }

        const errorMessage = _getSinErrorMessage(value, req.session.personal.sin)
        if (errorMessage) sinError = errorMessage

        /* if an error message exists, we failed validation */
        return !errorMessage
      },
      errorMessage: () => sinError,
    },
  },
}

const currentDate = new Date()

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

const isMatchingDoB = {
  errorMessage: 'errors.login.dateOfBirth.match',
  validate: (value, req) => {
    /* If there is no session, always return true */
    if (!req.session || !req.session.personal) {
      return true
    }

    return _toISOFormat(req.body) === '1974-01-08'
  },
}

const dobSchema = {
  dobDay: {
    ...isValidDay(),
    ...validationArray([isMatchingDoB]),
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
      options: { min: currentDate.getFullYear() - 200, max: currentDate.getFullYear() },
    },
  },
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

const dateOfResidenceSchema = {
  dobDay: isValidDay(),
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

const bankruptcySchema = {
  dobDay: isValidDay(),
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
  trusteeLastName: {
    isEmpty: {
      errorMessage: 'errors.login.trusteeLastName',
      negated: true,
    },
  },
}

const trilliumAmountSchema = {
  trilliumAmount: currencySchema(),
  trilliumPaymentMethod: {
    isIn: {
      errorMessage: 'errors.login.paymentMethod',
      options: [['cheque', 'directDeposit']],
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
  securityQuestionSchema,
  childSchema,
  dateOfResidenceSchema,
  bankruptcySchema,
  trilliumAmountSchema,
  addressesSchema,
  prisonSchema,
  _toISOFormat,
  _getSinErrorMessage,
}
