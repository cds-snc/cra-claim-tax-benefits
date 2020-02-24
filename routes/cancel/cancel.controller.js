const { routes } = require('../../config/routes.config')
module.exports = function(app) {
  app.get('/cancel', (req, res) => {
    const goodRoutes = routes.map(r=>r.path)
    const back = req.query.back || '/clear'
    const found = goodRoutes.includes(back)

    if (!found) {
      throw new Error(`[GET /cancel] Bad query parameter "${back}": must be a valid URL path`)
    }
    console.log(found)
    return res.render('cancel/cancel', {
      data: req.session,
      back,
    })
  })
}
