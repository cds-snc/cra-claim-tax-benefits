const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors, getDateDelta } = require('./../../utils')
const {
  addressSchema,
  maritalStatusSchema,
  nameSchema,
  residenceSchema,
} = require('./../../schemas')

module.exports = function(app) {
  app.get('/personal/name', renderWithData('personal/name'))
  app.post(
    '/personal/name',
    checkSchema(nameSchema),
    checkErrors('personal/name'),
    postName,
    doRedirect,
  )
  app.get('/personal/address', renderWithData('personal/address'))
  app.post(
    '/personal/address',
    checkSchema(addressSchema),
    checkErrors('personal/address'),
    postConfirmAddress,
    doRedirect,
  )

  app.get('/personal/residence', renderWithData('personal/residence'))
  app.post(
    '/personal/residence',
    checkSchema(residenceSchema),
    checkErrors('personal/residence'),
    postResidence,
    doRedirect,
  )

  app.get('/personal/maritalStatus', renderWithData('personal/maritalStatus'))
  app.post(
    '/personal/maritalStatus',
    checkSchema(maritalStatusSchema),
    checkErrors('personal/maritalStatus'),
    postConfirmMaritalStatus,
    doRedirect,
  )
}

const postResidence = (req, res, next) => {
  if (req.body.residence !== 'Ontario') {
    return res.redirect('/offramp/residence')
  }

  next()
}

const postName = (req, res, next) => {
  const name = req.body.name

  req.session.personal.confirmedName = name

  if (name !== 'Yes') {
    return res.redirect('/offramp/name')
  }

  next()
}

const postConfirmMaritalStatus = (req, res, next) => {
  const confirmMaritalStatus = req.body.confirmMaritalStatus

  req.session.personal.confirmedMaritalStatus = confirmMaritalStatus

  if (confirmMaritalStatus === 'No') {
    //Income details are not correct
    //Lead them to the offramp
    return res.redirect('/offramp/maritalStatus')
  }

  // Just basing the difference in months or years is not a good enough check so we are checking the total delta days
  if (getDateDelta(req.session.personal.dateOfBirth) === 23725 && confirmMaritalStatus === 'Yes') {
    return res.redirect('/deductions/senior-public-transit')
  }

  next()
}

const postConfirmAddress = (req, res, next) => {
  const confirmAddress = req.body.confirmAddress

  req.session.personal.confirmedAddress = confirmAddress

  if (confirmAddress === 'No') {
    //Income details are not correct
    //Lead them to the offramp
    return res.redirect('/offramp/address')
  }

  next()
}
