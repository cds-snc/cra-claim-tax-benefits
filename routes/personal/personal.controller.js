const { validationResult, checkSchema } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect } = require('./../../utils.js')
const { maritalStatusSchema } = require('./../../formSchemas.js')
const { maritalStatusOptions } = require('./../../formRadios.js')

module.exports = function(app) {
  app.get('/personal/address', (req, res) => res.render('personal/address'))

  app.get('/personal/maritalStatus', (req, res) => res.render('personal/maritalStatus', { data: req.session || {} }))

  app.get('/personal/maritalStatus/edit', (req, res) => res.render('personal/maritalStatus-edit', { maritalStatusOptions: maritalStatusOptions }))

  app.post('/personal/maritalStatus/edit', checkSchema(maritalStatusSchema),validateRedirect, postMaritalStatus)
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