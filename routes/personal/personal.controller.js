const { validationResult, checkSchema } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect } = require('./../../utils')
const { maritalStatusSchema, residenceSchema, addressSchema } = require('./../../formSchemas.js')

module.exports = function(app) {
  app.get('/personal/name', (req, res) => res.render('personal/name'))

  app.get('/personal/address', getAddress)
  app.get('/personal/address/edit', getAddressEdit)
  app.post('/personal/address/edit', validateRedirect, checkSchema(addressSchema), postAddress)

  app.get('/personal/residence', (req, res) => res.render('personal/residence'))
  app.post(
    '/personal/residence',
    checkSchema(residenceSchema),
    validateRedirect,
    postResidence,
  )

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

/* this is placeholder data until we get the real user info in here */
const fakeAddress = {
  aptNumber: '',
  streetNumber: '375',
  streetName: 'Rue Deschambault',
  postalCode: 'R2H 0J9',
  city: 'Winnipeg',
  province: 'Manitoba',
}

const getAddress = (req, res) => {
  // if no req.session.address, preload the fake address
  // otherwise, keep the address that's in the session
  req.session.address = req.session && req.session.address ? req.session.address : fakeAddress

  return res.render('personal/address', { data: req.session })
}

const getAddressEdit = (req, res) => {
  // if no req.session.address, preload the fake address
  // otherwise, keep the address that's in the session
  req.session.address = req.session && req.session.address ? req.session.address : fakeAddress

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

const postResidence = (req, res) => {
  const errors = validationResult(req)

  let residence = req.body.residence || null
  req.session.personal = {
    residence: residence,
  }

  if (!errors.isEmpty()) {
    return res.status(422).render('personal/residence', {
      data: { residence: req.body.residence } || {},
      errors: errorArray2ErrorObject(errors),
    })
  }

  if (errors.isEmpty() && req.body.residence === "yes") {
    return res.redirect('address')
  } else {
    return res.redirect('/start')
  }
}
