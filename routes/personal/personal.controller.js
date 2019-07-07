module.exports = function(app) {
  app.get('/address', (req, res) => res.render('personal/address'))
}
