const request = require('supertest')
const { extractCsrfToken, withCSRF } = require('../utils.spec')
const app = require('../../app.js')

describe('Test /personal responses', () => {
  const session = require('supertest-session')

  let csrfToken, cookie

  beforeEach(async () => {
    let testSession = session(app)
    const getresp = await testSession.get('/login/code')
    cookie = getresp.headers['set-cookie']
    csrfToken = extractCsrfToken(getresp)
  })

  describe('Test /personal 200 responses', () => {
    const urls = [
      '/personal/name',
      '/personal/maritalStatus',
      '/personal/residence',
      '/personal/address',
    ]

    urls.map(url => {
      test(`it returns a 200 response for the path: "${url}" path`, async () => {
        const response = await request(app).get(url)
        expect(response.statusCode).toBe(200)
      })
    })
  })

  describe('Test /personal/name responses', () => {
    test('it returns a 422 with no option selected', async () => {
      const response = await request(app)
        .post('/personal/name')
        .use(withCSRF(cookie, csrfToken))
      expect(response.statusCode).toBe(422)
    })

    test('it redirects to the offramp page when selecting No', async () => {
      const response = await request(app)
        .post('/personal/name')
        .use(withCSRF(cookie, csrfToken))
        .send({ name: 'No' })
      expect(response.headers.location).toEqual('/offramp/name')
      expect(response.statusCode).toBe(302)
    })

    test('it redirects to the provided redirect value when selecting Yes', async () => {
      const response = await request(app)
        .post('/personal/name')
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/start', name: 'Yes' })
      expect(response.headers.location).toEqual('/start')
      expect(response.statusCode).toBe(302)
    })

    test('it redirects to the checkAnswers when posting Yes and having come from the checkAnswers page', async () => {
      const response = await request(app)
        .post('/personal/name')
        .query({ ref: 'checkAnswers' })
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/start', name: 'Yes' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/checkAnswers')
    })
  })

  describe('Test /personal/maritalStatus responses', () => {
    test('it redirects to the offramp page when selecting No', async () => {
      const response = await request(app)
        .post('/personal/maritalStatus')
        .use(withCSRF(cookie, csrfToken))
        .send({ confirmMaritalStatus: 'No' })
      expect(response.headers.location).toEqual('/offramp/maritalStatus')
      expect(response.statusCode).toBe(302)
    })

    test('it redirects to the checkAnswers when posting Yes and having come from the checkAnswers page', async () => {
      const response = await request(app)
        .post('/personal/maritalStatus')
        .query({ ref: 'checkAnswers' })
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/start', confirmMaritalStatus: 'Yes' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/checkAnswers')
    })
  })

  describe('Test /personal/residence responses', () => {
    test('it returns a 422 with no option selected', async () => {
      const response = await request(app)
        .post('/personal/residence')
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/personal/address' })
      expect(response.statusCode).toBe(422)
    })

    test('it returns a 302 when selecting unsupported province', async () => {
      const response = await request(app)
        .post('/personal/residence')
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/offramp/residence', residence: 'Alberta' })
      expect(response.headers.location).toEqual('/offramp/residence')
      expect(response.statusCode).toBe(302)
    })

    test('it returns a 302 when selecting Ontario', async () => {
      const response = await request(app)
        .post('/personal/residence')
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/personal/address', residence: 'Ontario' })
      expect(response.headers.location).toEqual('/personal/address')
      expect(response.statusCode).toBe(302)
    })

    test('it redirects to the checkAnswers when posting Yes and having come from the checkAnswers page', async () => {
      const response = await request(app)
        .post('/personal/residence')
        .query({ ref: 'checkAnswers' })
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/start', residence: 'Ontario' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/checkAnswers')
    })
  })

  describe('Test /personal/address responses', () => {
    test('it redirects to the offramp page when selecting No', async () => {
      const response = await request(app)
        .post('/personal/address')
        .use(withCSRF(cookie, csrfToken))
        .send({ confirmAddress: 'No' })
      expect(response.headers.location).toEqual('/offramp/address')
      expect(response.statusCode).toBe(302)
    })

    test('it redirects to the checkAnswers when posting Yes and having come from the checkAnswers page', async () => {
      const response = await request(app)
        .post('/personal/address')
        .query({ ref: 'checkAnswers' })
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/start', confirmAddress: 'Yes' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/checkAnswers')
    })
  })
})
