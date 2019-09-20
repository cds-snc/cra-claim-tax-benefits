const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors, getPreviousRoute } = require('./../../utils')
const { reviewSchema } = require('./../../schemas')
const { formatAnswerInfo } = require('./checkAnswersFormat')

module.exports = function(app) {
  app.get('/confirmation', renderWithData('confirmation/confirmation'))

  app.get('/review', renderWithData('confirmation/review'))
  app.post('/review', checkSchema(reviewSchema), checkErrors('confirmation/review'), doRedirect)

  app.get('/checkAnswers', (req, res) => {
    res.render('confirmation/check-answers', {
      data: req.session,
      prevRoute: getPreviousRoute(req.path, req.session),
      answerInfo: formatAnswerInfo(req.session),
    })
  })
}
