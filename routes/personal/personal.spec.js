const request = require('supertest')
const app = require('../../app.js')

describe('Test /[personal] responses', () => {
  test('it returns a 200 response for the /address path', async () => {
    const response = await request(app).get('/address')
    expect(response.statusCode).toBe(200)
  })
})
