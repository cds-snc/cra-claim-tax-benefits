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

  test('it returns a 500 response if no redirect is provided', async () => {
    const response = await request(app).post('/login/code')
    expect(response.statusCode).toBe(500)
  })

  test('it reloads /login/code with a 422 status if no code is provided', async () => {
    const response = await request(app)
      .post('/login/code')
      .send({ redirect: '/' })
    expect(response.statusCode).toBe(422)
  })

  describe('Error list tests', () => {
    test('it renders the error-list for /login/code', async () => {
      const response = await request(app)
        .post('/login/code')
        .send({ redirect: '/' })
      const $ = cheerio.load(response.text)
      expect($('.error-list__header').text()).toEqual('Please correct the errors on the page')
      expect($('.error-list__list').children()).toHaveLength(1)
      expect($('.validation-message').text()).toEqual('Must be 8 characters')
      expect($('#code').attr('aria-describedby')).toEqual('code_error')
    })

    test('it renders an inline error for /login/code with appropriate describedby', async () => {
      const response = await request(app)
        .post('/login/code')
        .send({ redirect: '/' })
      const $ = cheerio.load(response.text)
      expect($('.validation-message').text()).toEqual('Must be 8 characters')
      expect($('#code').attr('aria-describedby')).toEqual('code_error')
    })
  })

  test('it does not allow a code more than 8 characters', async () => {
    const response = await request(app)
      .post('/login/code')
      .send({ code: 'A23XGY12111', redirect: '/' })
    expect(response.statusCode).toBe(422)
  })

  test('it does not allow a code less than 8 characters', async () => {
    const response = await request(app)
      .post('/login/code')
      .send({ code: 'A23X', redirect: '/' })
    expect(response.statusCode).toBe(422)
  })

  test('it does not allow non-alphanumeric characters', async () => {
    const response = await request(app)
      .post('/login/code')
      .send({ code: 'A23X456@', redirect: '/' })
    expect(response.statusCode).toBe(422)
  })

  test('it redirects to /login/success if a valid code is provided', async () => {
    const response = await request(app)
      .post('/login/code')
      .send({ code: 'A23XGY12', redirect: '/' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/')
  })

  test('it returns a 200 response for /login/success', async () => {
    const response = await request(app).get('/login/success')
    expect(response.statusCode).toBe(200)
  })
})
