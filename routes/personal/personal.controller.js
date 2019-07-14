const { validationResult, checkSchema } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect } = require('./../../utils')
const { maritalStatusSchema, addressSchema } = require('./../../formSchemas.js')

module.exports = function(app) {
  app.get('/personal/name', (req, res) => res.render('personal/name', { data: req.session }))

  app.get('/personal/address', (req, res) => res.render('personal/address', { data: req.session }))
  app.get('/personal/address/edit', (req, res) =>
    res.render('personal/address-edit', { data: req.session }),
  )
  app.post('/personal/address/edit', validateRedirect, checkSchema(addressSchema), postAddress)

  app.get('/personal/maritalStatus', (req, res) =>
    res.render('personal/maritalStatus', { data: req.session }),
  )
  app.get('/personal/maritalStatus/edit', (req, res) =>
    res.render('personal/maritalStatus-edit', { data: req.session }),
  )
  app.post(
    '/personal/maritalStatus/edit',
    validateRedirect,
    checkSchema(maritalStatusSchema),
    postMaritalStatus,
  )
}

const postAddress = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('personal/address-edit', {
      data: req.session,
      body: Object.assign({}, req.body),
      errors: errorArray2ErrorObject(errors),
    })
  }

  // copy all posted parameters, but remove the redirect
  let addressData = Object.assign({}, req.body)
  delete addressData.redirect

  req.session.personal.address = addressData

  return res.redirect(req.body.redirect)
}

const postMaritalStatus = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('personal/maritalStatus-edit', {
      data: req.session,
      errors: errorArray2ErrorObject(errors),
    })
  }

  req.session.personal.maritalStatus = req.body.maritalStatus

  return res.redirect(req.body.redirect)
}
