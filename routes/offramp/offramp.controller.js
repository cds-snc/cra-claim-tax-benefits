module.exports = function(app) {
  app.get('/offramp', (req, res) =>
    res.render('offramp/offramp', { data: req.session }),
  )

  app.get('/offramp-name', (req, res) =>
  res.render('offramp/offramp-name', { data: req.session }),
  )

  app.get('/offramp-residence', (req, res) =>
  res.render('offramp/offramp-residence', { data: req.session }),
  )

  app.get('/offramp-financial', (req, res) =>
  res.render('offramp/offramp-financial', { data: req.session }),
  )
}