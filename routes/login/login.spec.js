const request = require('supertest')
const cheerio = require('cheerio')
const app = require('../../app.js')

describe('Test /login responses', () => {
  test('it redirects to /login/code from /login', async () => {
    const response = await request(app).get('/login')
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login/code')
  })

  test('it returns a 200 response for /login/code', async () => {
    const response = await request(app).get('/login/code')
    expect(response.statusCode).toBe(200)
  })

  test('it renders the h1 text for /login/code', async () => {
    const response = await request(app).get('/login/code')

    const $ = cheerio.load(response.text)
    expect($('h1').text()).toEqual('Enter access code')
  })

  test('it reloads /login/code with a 422 status if no code is provided', async () => {
    const response = await request(app).post('/login/code')
    expect(response.statusCode).toBe(422)
  })

  test('it redirects to /login/success if a valid code is provided', async () => {
    const response = await request(app)
      .post('/login/code')
      .send({ code: 'OK' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login/success')
  })

  test('it returns a 200 response for /login/success', async () => {
    const response = await request(app).get('/login/success')
    expect(response.statusCode).toBe(200)
  })
})
