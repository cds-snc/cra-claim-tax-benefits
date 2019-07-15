const API = require('./api')

/**
 * Runs an array of validators over a value
 * this is a workaround I found to allow multiple custom validators
 * but still maintain individual error messages
 */
const validationArray = validators => {
  let errors = []

  return {
    custom: {
      errorMessage: () => {
        return errors.length ? errors[0] : 'value is invalid'
      },
      options: (value, { req }, opts) => {
        errors = []
        const results = validators.map(validator => {
          const result = validator.validate(value, req, opts)
          // If validation failed set current Error
          if (result === false) {
            const errorMessage = validator.errorMessage || `${value} is invalid`
            errors.push(errorMessage)
          }
          return result
        })
        return results.every(value => value === true)
      },
    },
  }
}

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
    const birthDateSplit = value.split('/')
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
    //month is not less than 1 or greater than 12
    const month = parseInt(value.split('/')[1], 10)
    return month >= 1 && month <= 12
  },
}

const validDay = {
  errorMessage: 'errors.login.dateOfBirth.validDay',
  validate: value => {
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

const isMatchingDoB = {
  errorMessage: 'errors.login.dateOfBirth.match',
  validate: (value, req) => {
    /* If there is no session, always return true */
    if (!req.session || !req.session.personal) {
      return true
    }

    return value === req.session.personal.dob
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
      isMatchingDoB,
    ]),
    isLength: {
      errorMessage: 'errors.login.dateOfBirth',
      //length with slashes
      options: { min: 10, max: 10 },
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

const addressSchema = {
  streetName: {
    isEmpty: {
      errorMessage: 'errors.address.streetName.empty',
      negated: true,
    },
  },
  city: {
    isEmpty: {
      errorMessage: 'errors.address.city.empty',
      negated: true,
    },
  },
  postalCode: {
    isEmpty: {
      errorMessage: 'errors.address.postalCode.empty',
      negated: true,
    },
    custom: {
      options: value => {
        // Source: https://gist.github.com/nery/9118763
        var postalCodeRegex = new RegExp(
          /^\s*[a-ceghj-npr-tvxy]\d[a-ceghj-npr-tv-z][-(\s)]?\d[a-ceghj-npr-tv-z]\d\s*$/i,
        )

        return postalCodeRegex.test(value)
      },
      errorMessage: 'errors.address.postalCode.format',
    },
  },
  province: {
    isIn: {
      errorMessage: 'errors.address.province.province',
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
  },
}

module.exports = {
  loginSchema,
  maritalStatusSchema,
  sinSchema,
  addressSchema,
  birthSchema,
}
