const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors } = require('./../../utils')
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
    (req, res, next) => {
      req.session.personal.residence = req.body.residence
      next()
    },
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
