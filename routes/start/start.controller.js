module.exports = function(app) {
  // redirect from "/" → "/start"
  app.get('/', (req, res) => res.redirect('/start'))
  app.get('/start', (req, res) => res.render('start/index'))
}
