const { checkSchema } = require('express-validator')
const { validateRedirect, renderWithData, checkErrors } = require('./../../utils')
const { incomeSchema } = require('./../../schemas')

module.exports = function(app) {
  app.get('/financial/income', renderWithData('financial/income'))
  app.post(
    '/financial/income',
    validateRedirect,
    checkSchema(incomeSchema),
    checkErrors('financial/income'),
    postConfirmIncome,
  )
}

const postConfirmIncome = (req, res) => {
  const confirmIncome = req.body.confirmIncome

  if (confirmIncome === 'No') {
    //Income details are not correct
    //Lead them to the offramp
    return res.redirect('/offramp/financial')
  }

  //Income confirmed, can continue normally
  return res.redirect(req.body.redirect)
}
