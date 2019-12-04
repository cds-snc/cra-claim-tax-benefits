const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors } = require('./../../utils')
const { incomeSchema } = require('./../../schemas')

module.exports = function(app) {
  app.get(
    '/financial/income',
    (req, res, next) => {
      if (process.env.NODE_ENV === 'test') return next()

      // if you haven't answered both security questions, redir to security Question page
      if (req.session && req.session.login.securityQuestion.length !== 2) {
        return res.redirect('/login/securityQuestion')
      }

      next()
    },
    renderWithData('financial/income'),
  )
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

  req.session.financial.incomeConfirmed = true
  next()
}
