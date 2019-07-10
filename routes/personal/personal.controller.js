const { validationResult, checkSchema } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect } = require('./../../utils.js')
const { maritalStatusSchema } = require('./../../formSchemas.js')

module.exports = function(app) {
  app.get('/personal/address', (req, res) => res.render('personal/address'))
  app.get('/personal/maritalStatus', (req, res) => res.render('personal/maritalStatus'))
  app.get('/personal/maritalStatus/edit', (req, res) => res.render('personal/maritalStatus-edit'))
  app.post('/personal/maritalStatus/edit', checkSchema(maritalStatusSchema),validateRedirect, postMaritalStatus)
}

const postMaritalStatus = (req, res) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('personal/maritalStatus-edit', {
      errors: errorArray2ErrorObject(errors),
    })
  }

  console.log(req.body.maritalStatus)
  //-TODO: this temporary, until we have user flow in place
  return res.status(200).render(req.body.redirect, { 
    data: {
      personal: {
        maritalStatus: req.body.maritalStatus
      }
    } 
  })
}