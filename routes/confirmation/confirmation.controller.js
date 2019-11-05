const { checkSchema } = require('express-validator')
const { doRedirect, renderWithData, checkErrors, getPreviousRoute } = require('./../../utils')
const { reviewSchema } = require('./../../schemas')
const { formatAnswerInfo } = require('./checkAnswersFormat')
const fs = require('fs')

module.exports = function(app) {
  app.get('/confirmation', (req, res) => {
    res.render('confirmation/confirmation', {
      data: req.session,
      prevRoute: getPreviousRoute(req),
      answerInfo: formatAnswerInfo(req),
    })

    outputXML(req, res)
  })

  app.get('/feedback', renderWithData('confirmation/feedback'))

  app.get('/review', renderWithData('confirmation/review'))
  app.post('/review', checkSchema(reviewSchema), checkErrors('confirmation/review'), doRedirect)

  app.get('/checkAnswers', (req, res) => {
    res.render('confirmation/check-answers', {
      data: req.session,
      prevRoute: getPreviousRoute(req),
      answerInfo: formatAnswerInfo(req),
    })
  })
}

const outputXML = (req, res) => {
  const user = {name:"azraq",country:"egypt", change:"yeah"};
  // const json = JSON.stringify(user);
  // const filename = 'user.json';
  // const mimetype = 'application/json';
  // res.setHeader('Content-Type', mimetype);
  // res.setHeader('Content-disposition','attachment; filename='+filename);
  // res.send( json );
  const data = JSON.stringify(user)

  fs.writeFileSync('xml_output/testjson.json', data, (err) => {
    if (err) throw err;
    console.log('File is created successfully.')
  })
}
