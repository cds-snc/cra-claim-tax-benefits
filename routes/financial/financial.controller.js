//TODO: remove this once we have the user json updated
const income = require('./testIncome.json')

module.exports = function(app) {
  app.get('/financial/income', (req, res) =>
  //TODO: update this with proper date later
    res.render('financial/income', { data: {
      ...req.session,
      financial: income,
    } || {} }),
  )
}
