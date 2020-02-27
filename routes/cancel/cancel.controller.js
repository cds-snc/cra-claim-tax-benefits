const { routes } = require('../../config/routes.config')
module.exports = function(app) {
  app.get('/cancel', (req, res) => {
    const back = req.query.back || '/clear'
    const found = routes.find(r => r.path === back)

    if (!found) {
      throw new Error(`[GET /cancel] Bad query parameter "${back}": must be a valid URL path`)
    }
    return res.render('cancel/cancel', {
      data: req.session,
      back,
    })
  })
}
