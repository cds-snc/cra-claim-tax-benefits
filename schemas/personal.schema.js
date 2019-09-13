const { yesNoSchema } = require('./utils.schema')

const maritalStatusSchema = {
  confirmMaritalStatus: yesNoSchema(),
}

const addressSchema = {
  confirmAddress: yesNoSchema(),
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