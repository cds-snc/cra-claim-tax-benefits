const { renderWithData } = require('./../../utils')

module.exports = function(app) {
  //TO DO: find a better solution for these. Just doing this to have the tests stop failing for now
  app.get('/offramp', renderWithData('offramp/offramp', 'login code'))

  app.get('/offramp/name', renderWithData('offramp/name', 'residence'))

  app.get('/offramp/residence', renderWithData('offramp/residence', 'address'))

  app.get('/offramp/financial', renderWithData('offramp/financial', 'rrsp'))
}
