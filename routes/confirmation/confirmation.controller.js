const { checkSchema } = require('express-validator')
const { validateRedirect, renderWithData, checkErrors } = require('./../../utils')
const { reviewSchema } = require('./../../schemas')

module.exports = function(app) {
  app.get('/confirmation', renderWithData('confirmation/confirmation'))

  app.get('/review', renderWithData('confirmation/review'))
  app.post(
    '/review',
    validateRedirect,
    checkSchema(reviewSchema),
    checkErrors('confirmation/review'),
    (req, res) => res.redirect(req.body.redirect),
  )
}
