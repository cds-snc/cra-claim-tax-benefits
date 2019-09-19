const currencySchema = (errorMessageString = 'errors.currency') => {
  return {
    customSanitizer: {
      options: value => {
        return value ? value : 0 //if blank we want to assume they meant 0
      },
    },
    isCurrency: {
      errorMessage: errorMessageString,
      options: { allow_negatives: false },
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
  validationArray,
}
