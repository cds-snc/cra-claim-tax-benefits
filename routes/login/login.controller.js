module.exports = function(app) {
  // redirect from "/login" → "/login/accessCode"
  app.get('/login', (req, res, next) => res.redirect('/login/code'))
  app.get('/login/code', (req, res, next) =>
    res.render('login/code', { title: 'Enter access code' }),
  )
}
