module.exports = function(app) {
  app.get('/confirmation', (req, res) =>
    res.render('confirmation/confirmation', { data: req.session || {} }),
  )
}
