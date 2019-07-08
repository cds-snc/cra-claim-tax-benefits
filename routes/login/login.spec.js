const request = require('supertest')
const cheerio = require('cheerio')
const app = require('../../app.js')

describe('Test /login responses', () => {
  //login page
  test('it redirects to /login/code from /login', async () => {
    const response = await request(app).get('/login')
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login/code')
  })

  //login/code
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
      expect($('.validation-message').text()).toEqual('Access code must be 8 characters')
      expect($('#code').attr('aria-describedby')).toEqual('code_error')
    })

    test('it renders an inline error for /login/code with appropriate describedby', async () => {
      const response = await request(app)
        .post('/login/code')
        .send({ redirect: '/' })
      const $ = cheerio.load(response.text)
      expect($('.validation-message').text()).toEqual('Access code must be 8 characters')
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

  const codes = ['QWER1234', 'qwer1234']
  codes.map(code => {
    test(`it redirects if a valid code is provided: "${code}"`, async () => {
      const response = await request(app)
        .post('/login/code')
        .send({ code, redirect: '/' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/')
    })
  })

  // Social Insurance Number Page /login/sin
  test('it returns a 200 response for /login/sin', async () => {
    const response = await request(app).get('/login/sin')
    expect(response.statusCode).toBe(200)
  })

  test('it renders the h1 text for /login/sin', async () => {
    const response = await request(app).get('/login/sin')

    const $ = cheerio.load(response.text)
    expect($('h1').text()).toEqual('Enter your Social Insurance Number (SIN)')
  })

  test('it returns a 500 response if no redirect is provided', async () => {
    const response = await request(app).post('/login/sin')
    expect(response.statusCode).toBe(500)
  })

  test('it reloads /login/sin with a 422 status if no sin is provided', async () => {
    const response = await request(app)
      .post('/login/sin')
      .send({ redirect: '/' })
    expect(response.statusCode).toBe(422)
  })

  describe('Error list tests', () => {
    test('it renders the error-list for /login/sin', async () => {
      const response = await request(app)
        .post('/login/sin')
        .send({ redirect: '/' })
      const $ = cheerio.load(response.text)
      expect($('.error-list__header').text()).toEqual('Please correct the errors on the page')
      expect($('.error-list__list').children()).toHaveLength(1)
      expect($('.validation-message').text()).toEqual('Your SIN should have 9 numbers')
      expect($('#sin').attr('aria-describedby')).toEqual('sin_error')
    })
  })
  /* this test seems to be doing the same thing as the one above. Do we need it?
      test('it renders an inline error for /login/code with appropriate describedby', async () => {
        const response = await request(app)
          .post('/login/code')
          .send({ redirect: '/' })
        const $ = cheerio.load(response.text)
        expect($('.validation-message').text()).toEqual('Access code must be 8 characters')
        expect($('#code').attr('aria-describedby')).toEqual('code_error')
      })
    })
  */
  test('it does not allow a code more than 9 characters', async () => {
    const response = await request(app)
      .post('/login/sin')
      .send({ code: '12345678910', redirect: '/' })
    expect(response.statusCode).toBe(422)
  })

  test('it does not allow a code less than 9 characters', async () => {
    const response = await request(app)
      .post('/login/sin')
      .send({ code: '12345678', redirect: '/' })
    expect(response.statusCode).toBe(422)
  })

  test('it does not allow non-numeric characters', async () => {
    const response = await request(app)
      .post('/login/code')
      .send({ code: 'A23X456@1', redirect: '/' })
    expect(response.statusCode).toBe(422)
  })

  //todo: validate that SIN is valid and matches the user's

  // Success page
  test('it returns a 200 response for /login/success', async () => {
    const response = await request(app).get('/login/success')
    expect(response.statusCode).toBe(200)
  })
})
