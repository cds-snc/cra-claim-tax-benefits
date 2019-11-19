const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors, returnToCheckAnswers } = require('./../../utils')
const {
  optInSchema,
  confirmRegistrationSchema,
} = require('./../../schemas')

module.exports = function(app) {
  app.get('/vote/optIn', renderWithData('vote/optIn'))
  app.post(
    '/vote/optIn',
    checkSchema(optInSchema),
    checkErrors('vote/optIn'),
    postOptIn,
    doRedirect,
  )
  app.get('/vote/confirmRegistration', renderWithData('vote/confirmRegistration'))
  app.post(
    '/vote/confirmRegistration',
    checkSchema(confirmRegistrationSchema),
    checkErrors('vote/confirmRegistration'),
    postConfirmRegistration,
    doRedirect,
  )
}

const postOptIn = (req, res, next) => {
  const confirmOptIn = req.body.confirmOptIn
  req.session.vote.confirmOptIn = confirmOptIn

  // if yes, go to second page of vote
  if (confirmOptIn == 'Yes') {
    //whether or not to display page 2 when going back from review
    req.session.vote.voterPageEdited = 1
    return res.redirect('/vote/confirmRegistration')
  }
  // if no, go to confirmation
  req.session.vote.voterCitizen = null
  req.session.vote.voterConsent = null
  req.session.vote.voterPageEdited = 0

  if (req.query.ref && req.query.ref === 'checkAnswers') {
    return returnToCheckAnswers(req, res, false)
  }
  next()
}

const postConfirmRegistration = (req, res, next) => {
  req.session.vote.voterCitizen = req.body.voterCitizen == 'voterCitizen' ? 'Yes' : 'No'
  req.session.vote.voterConsent = req.body.voterConsent == 'voterConsent' ? 'Yes' : 'No'

  next()
}