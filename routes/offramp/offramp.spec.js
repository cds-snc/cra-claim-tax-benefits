const request = require('supertest')
const app = require('../../app.js')

describe('Test /offramp responses', () => {
  const urls = [
    '/offramp/name',
    '/offramp/address',
    '/offramp/residence',
    '/offramp/children',
    '/offramp/dependants',
    '/offramp/tuition',
    '/offramp/maritalStatus',
    '/offramp/foreign-income',
    '/offramp/income-sources',
    '/offramp/taxable-income',
  ]

  urls.map(url => {
    test(`it returns a 200 response for ${url}`, async () => {
      const response = await request(app).get(url)
      expect(response.statusCode).toBe(200)
    })
  })
})
