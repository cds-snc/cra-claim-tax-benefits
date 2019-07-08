module.exports = function(app) {
  app.get('/personal/address', (req, res) => res.render('personal/address'))
}
