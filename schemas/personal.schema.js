const { yesNoSchema } = require('./utils.schema')

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
  line1: {
    isEmpty: {
      errorMessage: 'errors.address.line1.empty',
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
      errorMessage: 'errors.address.province',
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

const nameSchema = {
  name: yesNoSchema(),
}

const residenceSchema = {
  residence: {
    isIn: {
      errorMessage: 'errors.address.province',
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
          'Non Resident',
        ],
      ],
    },
  },
}

module.exports = {
  addressSchema,
  maritalStatusSchema,
  nameSchema,
  residenceSchema,
}