module.exports = function(app) {
  app.get('/cancel', (req, res) => {
    const back = req.query.back
    return res.render('cancel/cancel', {
      data: req.session,
      back,
    })
  })
}
