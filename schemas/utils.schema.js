const currencySchema = (errorMessageString = 'errors.currency', { allowEmpty = true } = {}) => {
  return {
    customSanitizer: {
      options: (value, { req }) => {
        let formattedValue = value

        if (req.locale === 'fr') {
          formattedValue = value.replace(',', '.').replace(' ', '').replace('$', '')
        } else if (formattedValue) {
          //including the commas makes it not a Number, and messes with formatting, so remove commas from en-CA format just for validation check
          formattedValue = value.replace(',', '')
        }

        return !formattedValue && allowEmpty ? 0 : formattedValue //if blank we want to assume they meant 0
      },
    },
    isCurrency: {
      errorMessage: errorMessageString,
      options: {
        allow_negatives: false,
      },
    },
  }
}

const yesNoSchema = (errorMessageString = 'errors.yesNo') => {
  return {
    isIn: {
      errorMessage: errorMessageString,
      options: [['Yes', 'No']],
    },
  }
}

const _currentDate = new Date()

const yearSchema = (errorMessageString = 'errors.login.dateOfBirth.validYear') => {
  return {
    isInt: {
      errorMessage: errorMessageString,
      options: { min: _currentDate.getFullYear() - 200, max: _currentDate.getFullYear() - 1 },
    },
  }
}

const monthSchema = (errorMessageString = 'errors.login.dateOfBirth.validMonth') => {
  return {
    isInt: {
      errorMessage: errorMessageString,
      options: { min: 1, max: 12 },
    },
  }
}

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

module.exports = {
  currencySchema,
  yesNoSchema,
  yearSchema,
  monthSchema,
  validationArray,
}
