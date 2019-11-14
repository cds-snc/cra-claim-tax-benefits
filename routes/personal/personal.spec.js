const request = require('supertest')
const { extractCsrfToken } = require('../../utils/index')
const app = require('../../app.js')

describe('Test /personal responses', () => {
  const session = require('supertest-session')

  let csrfToken,
    cookie

  beforeEach(async () => {
    let testSession = session(app)
    const getresp = await testSession.get('/financial/income')
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
      const response = await request(app).post('/personal/name')
        .set('Cookie', cookie)
        .send({ _csrf: csrfToken })
      expect(response.statusCode).toBe(422)
    })

    test('it redirects to the offramp page when selecting No', async () => {
      const response = await request(app)
        .post('/personal/name')
        .set('Cookie', cookie)
        .send({ _csrf: csrfToken, name: 'No' })
      expect(response.headers.location).toEqual('/offramp/name')
      expect(response.statusCode).toBe(302)
    })

    test('it redirects to the provided redirect value when selecting Yes', async () => {
      const response = await request(app)
        .post('/personal/name')
        .set('Cookie', cookie)
        .send({ _csrf: csrfToken, redirect: '/start', name: 'Yes' })
      expect(response.headers.location).toEqual('/start')
      expect(response.statusCode).toBe(302)
    })

    test('it redirects to the checkAnswers when posting Yes and having come from the checkAnswers page', async () => {
      const response = await request(app)
        .post('/personal/name')
        .query({ ref: 'checkAnswers' })
        .set('Cookie', cookie)
        .send({ _csrf: csrfToken, redirect: '/start', name: 'Yes' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/checkAnswers')
    })
  })

  describe('Test /personal/maritalStatus responses', () => {
    test('it redirects to the offramp page when selecting No', async () => {
      const response = await request(app)
        .post('/personal/maritalStatus')
        .set('Cookie', cookie)
        .send({ _csrf: csrfToken, confirmMaritalStatus: 'No' })
      expect(response.headers.location).toEqual('/offramp/maritalStatus')
      expect(response.statusCode).toBe(302)
    })

    test('it redirects to the checkAnswers when posting Yes and having come from the checkAnswers page', async () => {
      const response = await request(app)
        .post('/personal/maritalStatus')
        .query({ ref: 'checkAnswers' })
        .set('Cookie', cookie)
        .send({ _csrf: csrfToken, redirect: '/start', confirmMaritalStatus: 'Yes' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/checkAnswers')
    })
  })

  describe('Test /personal/residence responses', () => {
    test('it returns a 422 with no option selected', async () => {
      const response = await request(app)
        .post('/personal/residence')
        .set('Cookie', cookie)
        .send({ _csrf: csrfToken, redirect: '/personal/address' })
      expect(response.statusCode).toBe(422)
    })

    test('it returns a 302 when selecting unsupported province', async () => {
      const response = await request(app)
        .post('/personal/residence')
        .set('Cookie', cookie)
        .send({ _csrf: csrfToken, redirect: '/offramp/residence', residence: 'Alberta' })
      expect(response.headers.location).toEqual('/offramp/residence')
      expect(response.statusCode).toBe(302)
    })

    test('it returns a 302 when selecting Ontario', async () => {
      const response = await request(app)
        .post('/personal/residence')
        .set('Cookie', cookie)
        .send({ _csrf: csrfToken, redirect: '/personal/address', residence: 'Ontario' })
      expect(response.headers.location).toEqual('/personal/address')
      expect(response.statusCode).toBe(302)
    })

    test('it redirects to the checkAnswers when posting Yes and having come from the checkAnswers page', async () => {
      const response = await request(app)
        .post('/personal/residence')
        .query({ ref: 'checkAnswers' })
        .set('Cookie', cookie)
        .send({ _csrf: csrfToken, redirect: '/start', residence: 'Ontario' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/checkAnswers')
    })
  })

  describe('Test /personal/address responses', () => {
    test('it redirects to the offramp page when selecting No', async () => {
      const response = await request(app)
        .post('/personal/address')
        .set('Cookie', cookie)
        .send({ _csrf: csrfToken, confirmAddress: 'No' })
      expect(response.headers.location).toEqual('/offramp/address')
      expect(response.statusCode).toBe(302)
    })

    test('it redirects to the checkAnswers when posting Yes and having come from the checkAnswers page', async () => {
      const response = await request(app)
        .post('/personal/address')
        .query({ ref: 'checkAnswers' })
        .set('Cookie', cookie)
        .send({ _csrf: csrfToken, redirect: '/start', confirmAddress: 'Yes' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/checkAnswers')
    })
  })
})
