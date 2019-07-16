module.exports = function(app) {
    app.get('/offramp', (req, res) =>
      res.render('offramp/offramp', { data: req.session }),
    )
}