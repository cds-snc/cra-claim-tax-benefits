const request = require('supertest')
//const cheerio = require('cheerio')
const app = require('../../app.js')



describe('Test /deductions responses', () => {

  test('it redirects to /login/code from /deductions', async () => {
    const response = await request(app).get('/deductions')
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login/code')
  })


  test('it returns a 200 response for /deductions/rrsp', async () => {
    const response = await request(app).get('/deductions/rrsp')
    expect(response.statusCode).toBe(200)
  })

  test('it returns a 500 response if no redirect is provided', async () => {
    const response = await request(app).post('/deductions/rrsp')
    expect(response.statusCode).toBe(500)
  })

})