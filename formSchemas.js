const loginSchema = {
    code: {
      in: ['body'],
      isLength: {
        errorMessage: 'Must be 8 characters',
        options: { min: 8 }
      },
    },
  }

  module.exports = {
    loginSchema
  }