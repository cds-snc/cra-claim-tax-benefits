module.exports = function(app) {
  app.get('/financial/income', (req, res) =>
    res.render('financial/income', { data: req.session || {} }),
  )
}
