const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors } = require('./../../utils')
const { incomeSchema } = require('./../../schemas')

module.exports = function(app) {
  app.get(
    '/financial/income',
    (req, res, next) => {
      // if you have never answered the security question, redir to security Question page
      if (req.session && req.session.login.securityQuestion === null) {
        return res.redirect('/login/securityQuestion')
      }
      // if you have "skipped" the security question, skip to checkAnswers page
      // UNLESS you are coming from the checkAsnwers page, in which case, skip to securityQuestion page
      if (req.session && req.session.login.securityQuestion === '/checkAnswers') {
        return req.headers.referer.endsWith('/checkAnswers')
          ? res.redirect('/login/securityQuestion')
          : res.redirect('/checkAnswers')
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
