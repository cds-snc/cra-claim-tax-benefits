const request = require('supertest')
const app = require('../../app.js')



describe('Test /financial responses', () => {

  test('it redirects to /login/code from /financial', async () => {
    const response = await request(app).get('/financial')
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login/code')
  })


  test('it returns a 200 response for /financial/income', async () => {
    const response = await request(app).get('/financial/income')
    expect(response.statusCode).toBe(200)
  })

  test('it returns a 500 response if no redirect is provided', async () => {
    const response = await request(app).post('/financial/income')
    expect(response.statusCode).toBe(500)
  })

})