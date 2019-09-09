const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors, doAuth } = require('./../../utils')
const {
  addressSchema,
  maritalStatusSchema,
  nameSchema,
  residenceSchema,
} = require('./../../schemas')

module.exports = function(app) {
  app.get('/personal/name', renderWithData('personal/name', 'name'))
  app.post(
    '/personal/name',
    checkSchema(nameSchema),
    checkErrors('personal/name'),
    postName,
    doRedirect,
  )
  app.get('/personal/address', renderWithData('personal/address', 'address'))
  app.get('/personal/address/edit', doAuth, renderWithData('personal/address-edit', 'address edit'))
  app.post(
    '/personal/address/edit',
    doAuth,
    checkSchema(addressSchema),
    checkErrors('personal/address-edit'),
    postAddress,
    doRedirect,
  )

  app.get('/personal/residence', renderWithData('personal/residence', 'residence'))
  app.post(
    '/personal/residence',
    checkSchema(residenceSchema),
    checkErrors('personal/residence'),
    postResidence,
    doRedirect,
  )

  app.get('/personal/maritalStatus', renderWithData('personal/maritalStatus', 'marital status'))
  app.get('/personal/maritalStatus/edit', doAuth, renderWithData('personal/maritalStatus-edit', 'marital status edit'))
  app.post(
    '/personal/maritalStatus/edit',
    doAuth,
    checkSchema(maritalStatusSchema),
    checkErrors('personal/maritalStatus-edit'),
    (req, res, next) => {
      req.session.personal.maritalStatus = req.body.maritalStatus
      next()
    },
    doRedirect,
  )
}

const postAddress = (req, res, next) => {
  // copy all posted parameters, but remove the redirect
  let addressData = Object.assign({}, req.body)
  delete addressData.redirect

  req.session.personal.address = addressData

  next()
}

const postResidence = (req, res, next) => {
  if (req.body.residence !== 'Ontario') {
    return res.redirect('/offramp/residence')
  }

  next()
}

const postName = (req, res, next) => {
  const name = req.body.name

  if (name !== 'Yes') {
    return res.redirect('/offramp/name')
  }

  next()
}
