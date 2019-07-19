const { checkSchema } = require('express-validator')
const { validateRedirect, checkErrors } = require('./../../utils')
const { reviewSchema } = require('./../../formSchemas.js')

module.exports = function(app) {
  app.get('/confirmation', (req, res) =>
    res.render('confirmation/confirmation', { data: req.session }),
  )

  // Might make more sense to put this somewhere else?
  app.get('/review', (req, res) => res.render('confirmation/review', { data: req.session }))

  app.post(
    '/review',
    validateRedirect,
    checkSchema(reviewSchema),
    checkErrors('confirmation/review'),
    (req, res) => res.redirect(req.body.redirect),
  )
}
