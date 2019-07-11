const request = require('supertest')
const app = require('../../app.js')



describe('Test /dependants responses', () => {

  test('it redirects to /login/code from /dependants', async () => {
    const response = await request(app).get('/dependants')
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login/code')
  })


  test('it returns a 200 response for /dependants/children', async () => {
    const response = await request(app).get('/dependants/children')
    expect(response.statusCode).toBe(200)
  })

  test('it returns a 500 response if no redirect is provided', async () => {
    const response = await request(app).post('/dependants/children')
    expect(response.statusCode).toBe(500)
  })

})