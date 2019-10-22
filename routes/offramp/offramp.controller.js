const { renderWithData } = require('./../../utils')

module.exports = function(app) {
  app.get('/offramp', renderWithData('offramp/offramp'))

  app.get('/offramp/securityQuestion', renderWithData('offramp/securityQuestion'))

  app.get('/offramp/name', renderWithData('offramp/name'))

  app.get('/offramp/residence', renderWithData('offramp/residence'))

  app.get('/offramp/maritalStatus', renderWithData('offramp/maritalStatus'))

  app.get('/offramp/financial', renderWithData('offramp/financial'))
}
