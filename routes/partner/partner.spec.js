const request = require('supertest')
const app = require('../../app.js')

describe('Test /partner responses', () => {
  test.skip('it returns a 200 response for /partner/name', async () => {
    const response = await request(app).get('/partner/name')
    expect(response.statusCode).toBe(200)
  })
})
