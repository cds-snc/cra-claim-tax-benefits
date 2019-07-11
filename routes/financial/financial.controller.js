const { validationResult } = require('express-validator')
const { errorArray2ErrorObject, validateRedirect } = require('./../../utils')

module.exports = function(app) {
  // redirect from "/financial" → "/login/code", you really shouldn't be here (Unless we add a "info" page)
  app.get('/financial', (req, res) => res.redirect('/login/code'))

  app.get('/financial/income', (req, res) =>
    res.render('financial/income', { data: req.session || {} }),
  )
  app.post('/financial/income', validateRedirect, postIncome)
}

//Currently the income page can't be changed so this function might be redundant and unnessesary.
const postIncome = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('financial/income', {
      data: { income: req.body.income } || {},
      errors: errorArray2ErrorObject(errors),
    })
  }
  //Success, we can redirect to the next page
  return res.redirect(req.body.redirect)
}
