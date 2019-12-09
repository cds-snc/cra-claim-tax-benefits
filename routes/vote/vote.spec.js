const request = require('supertest')
const app = require('../../app.js')
const { extractCsrfToken, withCSRF } = require('../utils.spec')

describe('Test /vote responses', () => {
  const session = require('supertest-session')

  let csrfToken, cookie

  beforeEach(async () => {
    let testSession = session(app)
    const getresp = await testSession.get('/login/code')
    cookie = getresp.headers['set-cookie']
    csrfToken = extractCsrfToken(getresp)
  })

  test('it returns a 200 response for /vote/optIn', async () => {
    const response = await request(app).get('/vote/optIn')
    expect(response.statusCode).toBe(200)
  })

  test('it returns a 302 and redirects to /checkAnswers when NO is selected', async () => {
    const response = await request(app)
      .post('/vote/optIn')
      .use(withCSRF(cookie, csrfToken))
      .send({ confirmOptIn: 'No', redirect: '/checkAnswers' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/checkAnswers')
  })

  test('it returns a 302 and redirects to /vote/confirmRegistration when YES is selected', async () => {
    const response = await request(app)
      .post('/vote/optIn')
      .use(withCSRF(cookie, csrfToken))
      .send({ confirmOptIn: 'Yes', redirect: '/vote/confirmRegistration' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/vote/confirmRegistration')
  })

  test('it redirects to the /vote/confirmRegistration page when posting Yes and having come from the checkAnswers page', async () => {
    const response = await request(app)
      .post('/vote/optIn')
      .query({ ref: 'checkAnswers' })
      .use(withCSRF(cookie, csrfToken))
      .send({ confirmOptIn: 'Yes', redirect: '/vote/confirmRegistration' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/vote/confirmRegistration')
  })

  test('it returns a 200 response for /vote/confirmRegistration', async () => {
    const response = await request(app).get('/vote/confirmRegistration')
    expect(response.statusCode).toBe(200)
  })

  test('it returns a 302 and redirects to /checkAnswers when submitted', async () => {
    const response = await request(app)
      .post('/vote/confirmRegistration')
      .use(withCSRF(cookie, csrfToken))
      .send({ redirect: '/checkAnswers' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/checkAnswers')
  })

  test('it returns a 302 and redirects to /checkAnswers when submitted with data', async () => {
    const response = await request(app)
      .post('/vote/confirmRegistration')
      .use(withCSRF(cookie, csrfToken))
      .send({
        voterCitizen: 'voterCitizen',
        voterConsent: 'voterConsent',
        redirect: '/checkAnswers',
      })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/checkAnswers')
  })
})
