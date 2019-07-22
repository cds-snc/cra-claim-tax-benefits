module.exports = function(app) {
  // redirect from "/" → "/start"
  app.get('/', (req, res) => res.redirect('/start'))
  app.get('/start', (req, res) => res.render('start/index'))

  // loads the site in french from the get-go
  app.get('/commencer', (req, res) => {
    res.redirect('/start?lang=fr')
  })
}
