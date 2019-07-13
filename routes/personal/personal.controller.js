const { validationResult, checkSchema } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect } = require('./../../utils')
const { maritalStatusSchema, addressSchema } = require('./../../formSchemas.js')

module.exports = function(app) {
  app.get('/personal/name', (req, res) => res.render('personal/name', { data: req.session }))

  app.get('/personal/address', (req, res) => res.render('personal/address', { data: req.session }))
  app.get('/personal/address/edit', getAddressEdit)
  app.post('/personal/address/edit', validateRedirect, checkSchema(addressSchema), postAddress)

  app.get('/personal/maritalStatus', (req, res) =>
    res.render('personal/maritalStatus', { data: req.session || {} }),
  )
  app.get('/personal/maritalStatus/edit', (req, res) => res.render('personal/maritalStatus-edit'))
  app.post(
    '/personal/maritalStatus/edit',
    validateRedirect,
    checkSchema(maritalStatusSchema),
    postMaritalStatus,
  )
}

const getAddressEdit = (req, res) => {
  return res.render('personal/address-edit', { data: req.session })
}

const postAddress = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('personal/address-edit', {
      data: { ...req.session, ...{ address: req.body } },
      errors: errorArray2ErrorObject(errors),
    })
  }

  req.session.address = req.body

  return res.redirect(req.body.redirect)
}

const postMaritalStatus = (req, res) => {
  const errors = validationResult(req)

  let maritalStatus = req.body.maritalStatus || null
  req.session.personal = {
    maritalStatus: maritalStatus,
  }

  if (!errors.isEmpty()) {
    return res.status(422).render('personal/maritalStatus-edit', {
      data: { maritalStatus: req.body.maritalStatus } || {},
      errors: errorArray2ErrorObject(errors),
    })
  }

  return res.redirect(req.body.redirect)
}
