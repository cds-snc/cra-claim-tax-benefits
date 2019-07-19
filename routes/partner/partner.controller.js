module.exports = function(app) {
  app.get('/partner/name', (req, res) => res.render('partner/name', { data: req.session || {} }))
}
