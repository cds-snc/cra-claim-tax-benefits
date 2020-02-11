const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors, returnToCheckAnswers, doYesNo } = require('./../../utils')
const {
  optInSchema,
  citizenSchema,
  registerSchema,
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
  app.get('/vote/citizen', renderWithData('vote/citizen'))
  app.post(
    '/vote/citizen',
    checkSchema(citizenSchema),
    checkErrors('vote/citizen'),
    postCitizen,
    doRedirect,
  )
  app.get('/vote/register', renderWithData('vote/register'))
  app.post(
    '/vote/register',
    checkSchema(registerSchema),
    checkErrors('vote/register'),
    (req, res, next) => {
      req.session.vote.register = req.body.register
      next()
    },
    doRedirect,
  )
}

const postOptIn = (req, res, next) => {
  const confirmOptIn = req.body.confirmOptIn
  req.session.vote.confirmOptIn = confirmOptIn

  // if yes, go to second page of vote
  if (confirmOptIn === 'Yes') {
    return res.redirect('/vote/citizen')
  }
  // if no, go to confirmation
  req.session.vote.citizen= null
  req.session.vote.voterConsent = null

  if (req.query.ref && req.query.ref === 'checkAnswers') {
    return returnToCheckAnswers(req, res, false)
  }
  next()
}

const postCitizen = (req, res, next) => {
  const citizen = req.body.citizen
  req.session.vote.citizen = citizen

  if (citizen === 'Yes') {
    return res.redirect('/vote/register')
  }
  if (req.query.ref && req.query.ref === 'checkAnswers') {
    return returnToCheckAnswers(req, res, false)
  }
  next()
}