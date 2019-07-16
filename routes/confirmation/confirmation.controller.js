module.exports = function(app) {
  app.get('/confirmation', (req, res) =>
    res.render('confirmation/confirmation', { data: req.session }),
  )

  // Might make more sense to put this somewhere else?
  app.get('/review', (req, res) => res.render('confirmation/review', { data: req.session }))
}
