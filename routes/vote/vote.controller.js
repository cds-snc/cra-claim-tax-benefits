const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors } = require('./../../utils')
const {
  optInSchema,
  confirmRegistrationSchema
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
  app.get('/vote/confirmRegistration', renderWithData('vote/confirmRegistration'))
  app.post(
    '/vote/confirmRegistration',
    checkSchema(confirmRegistrationSchema),
    checkErrors('vote/confirmRegistration'),
    postConfirmRegistration,
    doRedirect
  )
}

const postOptIn = (req, res, next) => {
  const confirmOptIn = req.body.confirmOptIn
  req.session.vote.confirmOptIn = confirmOptIn;
  console.log(req.session)
  console.log(confirmOptIn)
  // if yes, go to second page of vote
  // if no, go to confirmation
  if (confirmOptIn == "No") {
    return res.redirect('/checkAnswers')
  }
  next()
}

const postConfirmRegistration = (req, res, next) => {
  console.log(req.session.vote.voterCitizen)
  console.log(req.session.vote.voterConsent)
  req.session.vote.voterCitizen = req.body.voterCitizen
  req.session.vote.voterConsent = req.body.voterConsent

  next()
}