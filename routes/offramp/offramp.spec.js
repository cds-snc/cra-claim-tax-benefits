const request = require('supertest')
const app = require('../../app.js')

describe('Test /offramp response', () => {
  test('it returns a 200 response for /offramp', async () => {
    const response = await request(app).get('/offramp')
    expect(response.statusCode).toBe(200)
  })
})
