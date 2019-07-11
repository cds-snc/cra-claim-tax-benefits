const { validationResult } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect } = require('./../../utils')

module.exports = function(app) {
  // redirect from "/partner" → "/login/code", you really shouldn't be here (Unless we add a "info" page)
  app.get('/partner', (req, res) => res.redirect('/login/code'))

  app.get('/partner/name', (req, res) => res.render('partner/name', { data: req.session || {} }))
  app.post('/partner/name', validateRedirect, postPartnerName)
}

const postPartnerName = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('partner/name', {
      data: { name: req.body.name } || {},
      errors: errorArray2ErrorObject(errors),
    })
  }

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}
