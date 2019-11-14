const request = require('supertest')
const app = require('../../app.js')
const { extractCsrfToken } = require('../../utils/index')

describe('Test /financial responses', () => {
  const session = require('supertest-session')

  let csrfToken,
    cookie

  beforeEach(async () => {
    let testSession = session(app)
    const getresp = await testSession.get('/financial/income')
    cookie = getresp.headers['set-cookie']
    csrfToken = extractCsrfToken(getresp)
  })
  
  test('it returns a 200 response for /financial/income', async () => {
    const response = await request(app).get('/financial/income')
    expect(response.statusCode).toBe(200)
  })

  test('it returns a 422 with no option selected', async () => {
    const response = await request(app)
      .post('/financial/income')
      .set('Cookie', cookie)
      .send({ _csrf: csrfToken, redirect: '/personal/maritalStatus' })
    expect(response.statusCode).toBe(422)
  })

  test('it returns a 302 and redirects to offramp when NO is selected', async () => {
    const response = await request(app)
      .post('/financial/income')
      .set('Cookie', cookie)
      .send({ _csrf: csrfToken, confirmIncome: 'No', redirect: '/offramp/financial' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/offramp/financial')
  })

  test('it returns a 302 and redirects to the same page when YES is selected', async () => {
    const response = await request(app)
      .post('/financial/income')
      .set('Cookie', cookie)
      .send({ _csrf: csrfToken, confirmIncome: 'Yes', redirect: '/personal/maritalStatus' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/personal/maritalStatus')
  })

  test('it redirects to the checkAnswers when posting Yes and having come from the checkAnswers page', async () => {
    const response = await request(app)
      .post('/financial/income')
      .query({ref: 'checkAnswers'})
      .set('Cookie', cookie)
      .send({ _csrf: csrfToken, confirmIncome: 'Yes', redirect: '/personal/maritalStatus' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/checkAnswers')
  }) 
})
