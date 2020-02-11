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

  test('it returns a 302 and redirects to /vote/citizen when YES is selected', async () => {
    const response = await request(app)
      .post('/vote/optIn')
      .use(withCSRF(cookie, csrfToken))
      .send({ confirmOptIn: 'Yes', redirect: '/vote/citizen' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/vote/citizen')
  })

  test('it redirects to the /vote/citizen page when posting Yes and having come from the checkAnswers page', async () => {
    const response = await request(app)
      .post('/vote/optIn')
      .query({ ref: 'checkAnswers' })
      .use(withCSRF(cookie, csrfToken))
      .send({ confirmOptIn: 'Yes', redirect: '/vote/citizen' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/vote/citizen')
  })

  test('it returns a 200 response for /vote/citizen', async () => {
    const response = await request(app).get('/vote/citizen')
    expect(response.statusCode).toBe(200)
  })

  test('it returns a 302 and redirects to /vote/register when YES is selected', async () => {
    const response = await request(app)
      .post('/vote/citizen')
      .use(withCSRF(cookie, csrfToken))
      .send({ citizen: 'Yes', redirect: '/vote/register' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/vote/register')
  })

  test('it redirects to the /vote/register page when posting Yes and having come from the checkAnswers page', async () => {
    const response = await request(app)
      .post('/vote/citizen')
      .query({ ref: 'checkAnswers' })
      .use(withCSRF(cookie, csrfToken))
      .send({ citizen: 'Yes', redirect: '/vote/register' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/vote/register')
  })

  test('it returns a 302 and redirects to /checkAnswers when NO is selected', async () => {
    const response = await request(app)
      .post('/vote/citizen')
      .use(withCSRF(cookie, csrfToken))
      .send({ citizen: 'No', redirect: '/checkAnswers' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/checkAnswers')
  })

  test('it returns a 200 response for /vote/register', async () => {
    const response = await request(app).get('/vote/register')
    expect(response.statusCode).toBe(200)
  })

  test('it returns a 302 and redirects to /checkAnswers when submitted with data', async () => {
    const response = await request(app)
      .post('/vote/register')
      .use(withCSRF(cookie, csrfToken))
      .send({
        register: 'Yes',
        redirect: '/checkAnswers',
      })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/checkAnswers')
  })
})
