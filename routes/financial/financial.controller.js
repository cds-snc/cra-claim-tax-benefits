const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors } = require('./../../utils')
const { incomeSchema } = require('./../../schemas')

module.exports = function(app) {
  app.get('/financial/income', renderWithData('financial/income', 'income'))
  app.post(
    '/financial/income',
    checkSchema(incomeSchema),
    checkErrors('financial/income'),
    postConfirmIncome,
    doRedirect,
  )
}

const postConfirmIncome = (req, res, next) => {
  const confirmIncome = req.body.confirmIncome

  if (confirmIncome === 'No') {
    //Income details are not correct
    //Lead them to the offramp
    return res.redirect('/offramp/financial')
  }

  next()
}
