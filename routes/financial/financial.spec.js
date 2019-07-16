const request = require('supertest')
const app = require('../../app.js')

describe('Test /financial responses', () => {
  test('it returns a 200 response for /financial/income', async () => {
    const response = await request(app).get('/financial/income')
    expect(response.statusCode).toBe(200)
  })
})
