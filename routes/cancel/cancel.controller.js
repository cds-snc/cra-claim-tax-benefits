module.exports = function(app) {
  app.get('/cancel', (req, res) => {
    console.log(req.query)
    const query = { back: '/eligibility/age' }
    const back = query.back
    return res.render('cancel/cancel', {
      data: req.session,
      back,
    })
  })
}
