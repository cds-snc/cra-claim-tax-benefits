const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors } = require('./../../utils')
const { reviewSchema } = require('./../../schemas')

module.exports = function(app) {
  app.get('/confirmation', renderWithData('confirmation/confirmation', 'confirmation'))

  app.get('/review', renderWithData('confirmation/review', 'review'))
  app.post('/review', checkSchema(reviewSchema), checkErrors('confirmation/review'), doRedirect)
}
