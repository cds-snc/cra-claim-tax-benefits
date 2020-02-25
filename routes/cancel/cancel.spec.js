const request = require('supertest')
const app = require('../../app.js')

describe('Test /cancel responses', () => {
  test(`it returns a 200 response for /cancel`, async () => {
    const response = await request(app).get('/cancel')
    expect(response.statusCode).toBe(200)
  })

  test('it returns a 500 response if no redirect is provided', async () => {
    const response = await request(app).get('/cancel?back=evil')
    expect(response.statusCode).toBe(500)
  })
})
