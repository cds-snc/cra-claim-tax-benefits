const request = require('supertest')
const { extractCsrfToken, withCSRF } = require('../utils.spec')
const app = require('../../app.js')

describe('Test confirmation urls', () => {
  const urls = ['/review', '/checkAnswers', '/confirmation', '/feedback']

  urls.map(url => {
    test(`${url} returns a 200 response`, async () => {
      const response = await request(app).get(url)
      expect(response.statusCode).toBe(200)
    })
  })
})

describe('Test /download', () => {
  test('It returns a 500 response', async () => {
    const response = await request(app).get('/download')
    expect(response.statusCode).toBe(500)
    expect(response.text).toMatch('Download not available')
  })
})

describe('Test /review', () => {
  const session = require('supertest-session')

  let csrfToken, cookie

  beforeEach(async () => {
    let testSession = session(app)
    const getresp = await testSession.get('/login/code')
    cookie = getresp.headers['set-cookie']
    csrfToken = extractCsrfToken(getresp)
  })

  describe('POST responses', () => {
    test('it returns a 422 response if no values are posted', async () => {
      const response = await request(app)
        .post('/review')
        .use(withCSRF(cookie, csrfToken))
      expect(response.statusCode).toBe(422)
    })

    test('it returns a 422 response for no posted value', async () => {
      const response = await request(app)
        .post('/review')
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/confirmation' })
      expect(response.statusCode).toBe(422)
    })

    test('it returns a 500 response if no redirect is provided', async () => {
      const response = await request(app)
        .post('/review')
        .use(withCSRF(cookie, csrfToken))
        .send({ review: 'review' })
      expect(response.statusCode).toBe(500)
    })

    test('it returns a 422 response for the wrong value', async () => {
      const response = await request(app)
        .post('/review')
        .use(withCSRF(cookie, csrfToken))
        .send({ review: 'get er done', redirect: '/confirmation' })
      expect(response.statusCode).toBe(422)
    })

    test('it returns a 302 response for the right value', async () => {
      const response = await request(app)
        .post('/review')
        .use(withCSRF(cookie, csrfToken))
        .send({ review: 'review', redirect: '/confirmation' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/confirmation')
    })
  })
})
