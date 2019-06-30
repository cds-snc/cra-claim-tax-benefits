module.exports = function(app) {
  // redirect from "/login" → "/login/accessCode"
  app.get('/login', (req, res) => res.redirect('/login/code'))
  app.get('/login/code', (req, res) => res.render('login/code', { title: 'Enter access code' }))
}
