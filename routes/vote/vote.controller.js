const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors } = require('./../../utils')
const {
  optInSchema
} = require('./../../schemas')

module.exports = function(app) {
  app.get('/vote/optIn', renderWithData('vote/optIn'))
  app.post(
    '/vote/optIn',
    checkSchema(optInSchema),
    checkErrors('vote/optIn'),
    postOptIn,
    doRedirect
  )
}

const postOptIn = (req, res, next) => {
  const confirmOptIn = req.body.confirmOptIn

  // if yes, go to second page of vote
  // if no, go to confirmation
  next()
}