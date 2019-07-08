module.exports = function(app) {
  app.get('/personal/address', (req, res) => res.render('personal/address'))
  app.get('/personal/maritalStatus', (req, res) => res.render('personal/maritalStatus'))
  app.get('/personal/maritalStatus/edit', (req, res) => res.render('personal/maritalStatus-edit'))
}
