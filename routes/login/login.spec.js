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
})
