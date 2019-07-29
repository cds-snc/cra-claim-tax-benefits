const { checkSchema } = require('express-validator')
const { validateRedirect, checkErrors, doAuth } = require('./../../utils')
const { maritalStatusSchema, addressSchema, residenceSchema, nameSchema } = require('./../../formSchemas.js')

module.exports = function(app) {
  app.get('/personal/name', (req, res) => res.render('personal/name', { data: req.session }))
  app.post(
    '/personal/name',
    validateRedirect,
    checkSchema(nameSchema),
    checkErrors('personal/name'),
    postName,
  )
  app.get('/personal/address', (req, res) => res.render('personal/address', { data: req.session }))
  app.get('/personal/address/edit', doAuth, (req, res) =>
    res.render('personal/address-edit', { data: req.session }),
  )
  app.post(
    '/personal/address/edit',
    doAuth,
    validateRedirect,
    checkSchema(addressSchema),
    checkErrors('personal/address-edit'),
    postAddress,
  )

  app.get('/personal/residence', (req, res) => res.render('personal/residence'))
  app.post(
    '/personal/residence',
    validateRedirect,
    checkSchema(residenceSchema),
    checkErrors('personal/residence'),
    postResidence,
  )

  app.get('/personal/maritalStatus', (req, res) =>
    res.render('personal/maritalStatus', { data: req.session }),
  )
  app.get('/personal/maritalStatus/edit', doAuth, (req, res) =>
    res.render('personal/maritalStatus-edit', { data: req.session }),
  )
  app.post(
    '/personal/maritalStatus/edit',
    doAuth,
    validateRedirect,
    checkSchema(maritalStatusSchema),
    checkErrors('personal/maritalStatus-edit'),
    postMaritalStatus,
  )
}

const postAddress = (req, res) => {
  // copy all posted parameters, but remove the redirect
  let addressData = Object.assign({}, req.body)
  delete addressData.redirect

  req.session.personal.address = addressData

  return res.redirect(req.body.redirect)
}

const postMaritalStatus = (req, res) => {
  req.session.personal.maritalStatus = req.body.maritalStatus

  return res.redirect(req.body.redirect)
}

const postResidence = (req, res) => {
  if (req.body.residence !== 'Ontario') {
    return res.redirect('/offramp/residence')
  }

  return res.redirect(req.body.redirect)
}

const postName = (req, res) => {
  const name = req.body.name

  if (name !== 'Yes') {
    return res.redirect('/offramp/name')
  }

  return res.redirect(req.body.redirect)
}
