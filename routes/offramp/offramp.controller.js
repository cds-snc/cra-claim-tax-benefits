const { renderWithData } = require('./../../utils')

module.exports = function(app) {
  app.get('/offramp', renderWithData('offramp/offramp'))

  app.get('/offramp/securityQuestion', renderWithData('offramp/securityQuestion'))

  app.get('/offramp/name', renderWithData('offramp/name'))

  app.get('/offramp/residence', renderWithData('offramp/residence'))

  app.get('/offramp/maritalStatus', renderWithData('offramp/maritalStatus'))
  
  app.get('/offramp/address', renderWithData('offramp/address'))

  app.get('/offramp/financial', renderWithData('offramp/financial'))

  app.get('/offramp/dependants', renderWithData('offramp/dependants'))

  app.get('/offramp/tuition', renderWithData('offramp/tuition'))

  app.get('/offramp/income-sources', renderWithData('offramp/income-sources'))

  app.get('/offramp/foreign-income', renderWithData('offramp/foreign-income'))

  app.get('/offramp/taxable-income', renderWithData('offramp/taxable-income'))

  app.get('/offramp/children', renderWithData('offramp/children'))
}
