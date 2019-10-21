const url = require('url')

module.exports = function(app) {
  // redirect from "/" → "/start"
  // preserve query params
  app.get('/', (req, res) => {
    return res.redirect(url.format({ pathname: '/start', query: req.query }))
  })
  app.get('/start', (req, res) => res.render('start/index'))

  // loads the site in french from the get-go
  app.get('/commencer', (req, res) => {
    res.redirect('/start?lang=fr')
  })
}
