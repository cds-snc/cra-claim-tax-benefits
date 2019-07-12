const { validationResult } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect } = require('./../../utils')

module.exports = function(app) {
  // redirect from "/dependants" → "/login/code", you really shouldn't be here (Unless we add a "info" page)
  app.get('/dependants', (req, res) => res.redirect('/login/code'))

  app.get('/dependants/children', (req, res) =>
    res.render('dependants/children', { data: req.session || {} }),
  )
  app.post('/dependants/children', validateRedirect, postChildren)
}

const postChildren = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('dependants/children', {
      data: { children: req.body.children } || {},
      errors: errorArray2ErrorObject(errors),
    })
  }

  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}
