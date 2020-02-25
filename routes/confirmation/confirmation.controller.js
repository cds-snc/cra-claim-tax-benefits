const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors, getPreviousRoute } = require('./../../utils')
const { confirmIncomeSchema } = require('./../../schemas')
const { formatAnswerInfo } = require('./checkAnswersFormat')
const { outputXML } = require('./xmlFormat')

module.exports = function(app) {
  app.get('/confirmation', (req, res) => {
    res.render('confirmation/confirmation', {
      data: req.session,
      prevRoute: getPreviousRoute(req),
      answerInfo: formatAnswerInfo(req),
    })

    outputXML(req)
  })

  app.get('/download', (req, res) => {
    /**
     * I imagine back in outputXML, we'll want to disable the download button until the function is done. We'll rarely see it happen, but just to avoid any issues around downloading and incomplete file
     */
    const file = process.env.NODE_ENV === 'test' ? 'fake.xml' : './xml_output/taxfile-2019.xml'
    res.download(file, 'taxfile-2019.xml', err => {
      if (err) {
        res.status(500).send('Download not available')
      }
    })
  })

  app.get('/feedback', renderWithData('confirmation/feedback'))

  app.get('/confirm-income', renderWithData('confirmation/income'))
  app.post(
    '/confirm-income',
    checkSchema(confirmIncomeSchema),
    checkErrors('confirmation/income'),
    postConfirmIncome,
    doRedirect,
  )

  app.get('/checkAnswers', (req, res) => {
    res.render('confirmation/check-answers', {
      data: req.session,
      prevRoute: getPreviousRoute(req),
      answerInfo: formatAnswerInfo(req),
      path: req.path,
    })
  })
}

const postConfirmIncome = (req, res, next) => {
  if (req.body.confirmIncome) {
    req.session.financial.incomeConfirmed = true
  }
  next()
}
