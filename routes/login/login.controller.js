module.exports = function(app) {
  // redirect from "/login" → "/login/accessCode"
  app.get('/login', (req, res) => res.redirect('/login/code'))
  app.get('/login/code', (req, res) =>
    res.render('login/code', { title: 'Enter access code', data: req.session || {} }),
  )
  app.post('/login/code', postCode)
}

const postCode = (req, res) => {
  let accessCode = req.body.code || null
  req.session = accessCode ? { code: accessCode } : null

  res.render('login/code', { title: 'Enter access code', data: req.session || {} })
}
