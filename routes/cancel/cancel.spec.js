const request = require('supertest')
const app = require('../../app.js')
const cheerio = require('cheerio')

describe('Test /cancel responses', () => {
  test('it returns a 200 response for /cancel with no back path (routes to /clear on Go Back)', async () => {
    const response = await request(app).get('/cancel')
    expect(response.statusCode).toBe(200)

    const $ = cheerio.load(response.text)
    expect($('.buttons-row a + a').attr('href')).toEqual('/clear')
  })

  test('it returns a 500 response if back path is not whitelisted + has proper error message', async () => {
    const response = await request(app).get('/cancel?back=/evil')
    expect(response.statusCode).toBe(500)
    expect(response.error.message).toEqual('cannot GET /cancel?back=/evil (500)')
  })

  test('it returns a 200 response if back path is whitelisted (routes to back path on Go Back)', async () => {
    const response = await request(app).get('/cancel?back=/start')
    expect(response.statusCode).toBe(200)

    const $ = cheerio.load(response.text)
    expect($('.buttons-row a + a').attr('href')).toEqual('/start')
  })
})
