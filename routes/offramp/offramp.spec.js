const request = require('supertest')
const app = require('../../app.js')

describe('Test /offramp responses', () => {
  const urls = [
    '/offramp',
    '/offramp/name',
    '/offramp/address',
    '/offramp/residence',
    '/offramp/maritalStatus',
    '/offramp/financial',
    '/offramp/securityQuestion',
  ]

  urls.map(url => {
    test(`it returns a 200 response for ${url}`, async () => {
      const response = await request(app).get('/offramp')
      expect(response.statusCode).toBe(200)
    })
  })
})
