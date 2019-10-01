const { validationArray, currencySchema } = require('./utils.schema')
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
    let month = parseInt(req.body.dobMonth, 10)
    const day = parseInt(value, 10)

    if (!day || !month || !year) {
      return false
    }

    //subtract one because Date for months starts at a 0 index for Jan 🤓
    month -= 1
    return day >= 1 && day <= lastDayInMonth(year, month)
  },
}

const toISOFormat = ({ dobYear, dobMonth, dobDay }) => {
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

    return toISOFormat(req.body) === req.session.personal.dateOfBirth
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
  dobDay: {
    ...validationArray([isValidDay]),
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

const bankruptcySchema = {
  dobDay: {
    ...validationArray([isValidDay]),
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
  dobDay: {
    ...validationArray([isValidDay]),
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
  securityQuestionSchema,
  childSchema,
  bankruptcySchema,
  trilliumAmountSchema,
  addressesSchema,
  prisonSchema,
  lastDayInMonth,
  toISOFormat,
}
