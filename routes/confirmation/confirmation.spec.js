const request = require('supertest')
const app = require('../../app.js')

describe('Test /confirmation response', () => {
  test('it returns a 200 response for /confirmation', async () => {
    const response = await request(app).get('/confirmation')
    expect(response.statusCode).toBe(200)
  })

  test('it returns a 200 response for /review', async () => {
    const response = await request(app).get('/review')
    expect(response.statusCode).toBe(200)
  })
})
