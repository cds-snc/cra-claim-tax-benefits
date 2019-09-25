const request = require('supertest')
const session = require('supertest-session')
const cheerio = require('cheerio')
const app = require('../../app.js')

describe('Test /login responses', () => {
  const urls = ['/login/code', '/login/sin', '/login/dateOfBirth']
  urls.map(url => {
    test(`it returns a 200 response for ${url}`, async () => {
      const response = await request(app).get(url)
      expect(response.statusCode).toBe(200)
    })

    test(`it returns a 422 response for ${url} if nothing is posted`, async () => {
      const response = await request(app).post(url)
      expect(response.statusCode).toBe(422)
    })

    test(`it returns a 422 response for ${url} if only a redirect is posted`, async () => {
      const response = await request(app)
        .post(url)
        .send({ redirect: '/' })
      expect(response.statusCode).toBe(422)
    })
  })

  //login page
  test('it redirects to /login/code from /login', async () => {
    const response = await request(app).get('/login')
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/login/code')
  })

  test('it renders the h1 text for /login/code', async () => {
    const response = await request(app).get('/login/code')

    const $ = cheerio.load(response.text)
    expect($('h1').text()).toEqual('Enter your personal filing code')
  })

  test('it returns a 500 response if no redirect is provided', async () => {
    const response = await request(app)
      .post('/login/code')
      .send({ code: 'A5G98S4K1' })
    expect(response.statusCode).toBe(500)
  })

  test('it autofocuses on the single input on the page', async () => {
    const response = await request(app).get('/login/code')
    const $ = cheerio.load(response.text)
    expect($('#code').attr('autofocus')).toEqual('autofocus')
  })

  describe('Error list tests', () => {
    test('it renders the error-list for /login/code', async () => {
      const response = await request(app)
        .post('/login/code')
        .send({ redirect: '/' })
      const $ = cheerio.load(response.text)
      expect($('title').text()).toMatch(/^Error:/)
      expect($('.error-list__header').text()).toEqual('Please correct the errors on the page')
      expect($('.error-list__list').children()).toHaveLength(1)
      expect($('.validation-message').text()).toEqual('Error: Access code must be 9 characters')
      expect($('#code').attr('aria-describedby')).toEqual('code-error')
      expect($('#code').attr('autofocus')).toEqual('autofocus')
    })

    test('it renders an inline error for /login/code with appropriate describedby', async () => {
      const response = await request(app)
        .post('/login/code')
        .send({ redirect: '/' })
      const $ = cheerio.load(response.text)
      expect($('.validation-message').text()).toEqual('Error: Access code must be 9 characters')
      expect($('#code').attr('aria-describedby')).toEqual('code-error')
    })
  })

  test('it does not allow a code more than 9 characters', async () => {
    const response = await request(app)
      .post('/login/code')
      .send({ code: '23XGY12111', redirect: '/' })
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

  const codes = ['A5G98S4K1', 'a5g98S4K1', 'a5g98s4k1'] //check uppercase, lowercase and mixedcase
  codes.map(code => {
    test(`it redirects if a valid code is provided: "${code}"`, async () => {
      const response = await request(app)
        .post('/login/code')
        .send({ code, redirect: '/' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/')
    })
  })

  describe('Test /login/sin responses', () => {
    // Social Insurance Number Page /login/sin
    test('it renders the h1 text for /login/sin', async () => {
      const response = await request(app).get('/login/sin')

      const $ = cheerio.load(response.text)
      expect($('h1').text()).toEqual('Enter your Social insurance number (SIN)')
    })

    test('it returns a 500 response if no redirect is provided', async () => {
      const response = await request(app)
        .post('/login/sin')
        .send({ sin: '847 339 283' })
      expect(response.statusCode).toBe(500)
    })

    test('it reloads /login/sin with a 422 status if no sin is provided', async () => {
      const response = await request(app)
        .post('/login/sin')
        .send({ redirect: '/' })
      expect(response.statusCode).toBe(422)
      const $ = cheerio.load(response.text)
      expect($('title').text()).toMatch(/^Error:/)
      expect($('.error-list__header').text()).toEqual('Please correct the errors on the page')
      expect($('.error-list__list').children()).toHaveLength(1)
      expect($('.validation-message').text()).toEqual('Error: Your SIN should have 9 numbers')
      expect($('#sin').attr('aria-describedby')).toEqual('sin-error')
    })

    describe('Error list tests', () => {
      test('it renders the error-list for /login/sin', async () => {
        const response = await request(app)
          .post('/login/sin')
          .send({ redirect: '/' })
        const $ = cheerio.load(response.text)
        expect($('title').text()).toMatch(/^Error:/)
        expect($('.error-list__header').text()).toEqual('Please correct the errors on the page')
        expect($('.error-list__list').children()).toHaveLength(1)
        expect($('.validation-message').text()).toEqual('Error: Your SIN should have 9 numbers')
        expect($('#sin').attr('aria-describedby')).toEqual('sin-error')
      })
    })

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

    /*
      These tests make sure that a SIN which would ordinarily be
      accepted (ie, "123456789") is no longer accepted after
      a user logs in.

      After that, only the sin used by the user in /api/user.json
      will be accepted.
    */
    describe('after entering an access code', () => {
      let authSession

      beforeEach(async () => {
        authSession = session(app)
        const response = await authSession
          .post('/login/code')
          .send({ code: 'A5G98S4K1', redirect: '/login/sin' })
        expect(response.statusCode).toBe(302)
      })

      it('it should return 422 for the wrong SIN', async () => {
        const response = await authSession
          .post('/login/sin')
          .send({ sin: '123456789', redirect: '/login/sin' })
        expect(response.statusCode).toBe(422)
      })

      it('it should return 302 for the right SIN', async () => {
        const response = await authSession
          .post('/login/sin')
          .send({ sin: '847 339 283', redirect: '/login/sin' })
        expect(response.statusCode).toBe(302)
      })
    })
  })

  describe('Test login/dateOfBirth responses', () => {
    let goodDoBRequest = {
      dobDay: '09',
      dobMonth: '09',
      dobYear: '1977',
      redirect: '/login/success',
    }

    const currentDate = new Date()

    const badDoBRequests = [
      {
        label: 'no date of birth',
        send: {
          ...goodDoBRequest,
          ...{ dobDay: '', dobMonth: '', dobYear: '' },
        },
      },
      {
        label: 'no day',
        send: {
          ...goodDoBRequest,
          ...{ dobDay: '' },
        },
      },
      {
        label: 'no month',
        send: {
          ...goodDoBRequest,
          ...{ dobMonth: '' },
        },
      },
      {
        label: 'no year',
        send: {
          ...goodDoBRequest,
          ...{ dobYear: '' },
        },
      },
      {
        label: 'date of birth includes not allowed characters',
        send: {
          ...goodDoBRequest,
          ...{ dobDay: 'ee' },
        },
      },
      {
        label: 'date of birth month is less than 1',
        send: {
          ...goodDoBRequest,
          ...{ dobMonth: '0' },
        },
      },
      {
        label: 'date of birth month is greater than 12',
        send: {
          ...goodDoBRequest,
          ...{ dobMonth: '13' },
        },
      },
      {
        label: 'date of birth day is less than 1',
        send: {
          ...goodDoBRequest,
          ...{ dobDay: '0' },
        },
      },
      {
        label: 'date of birth day is greater than in that month',
        send: {
          ...goodDoBRequest,
          ...{ dobDay: '29', dobMonth: '02', dobYear: '2019' },
        },
      },
      {
        label: 'date of birth is less than a year ago',
        send: {
          ...goodDoBRequest,
          ...{
            dobDay: currentDate.getDate(),
            dobMonth: currentDate.getMonth() - 3,
            dobYear: currentDate.getFullYear(),
          },
        },
      },
      {
        label: 'date of birth is more than 200 years ago',
        send: {
          ...goodDoBRequest,
          ...{
            dobDay: currentDate.getDate(),
            dobMonth: currentDate.getMonth(),
            dobYear: currentDate.getFullYear() - 200,
          },
        },
      },
    ]

    badDoBRequests.map(badRequest => {
      test(`it returns a 422 with: "${badRequest.label}"`, async () => {
        const response = await request(app)
          .post('/login/dateOfBirth')
          .send(badRequest.send)
        expect(response.statusCode).toBe(422)
      })
    })

    test('it returns a 302 with valid dob', async () => {
      const response = await request(app)
        .post('/login/dateOfBirth')
        .send(goodDoBRequest)
      expect(response.statusCode).toBe(302)
    })
  })

  /*
      These tests make sure that a date of birth which would ordinarily be is no longer accepted after
      a user logs in.

      After that, only the date of birth corressponding to the user in /api/user.json
      will be accepted.
    */
  describe('after entering an access code', () => {
    let authSession

    beforeEach(async () => {
      authSession = session(app)
      const response = await authSession
        .post('/login/code')
        .send({ code: 'A5G98S4K1', redirect: '/login/sin' })
        .then(() => {
          return authSession
            .post('/login/sin')
            .send({ sin: '847339283', redirect: '/login/dateOfBirth' })
        })
      expect(response.statusCode).toBe(302)
    })

    it('it should return 422 for the wrong DoB', async () => {
      const response = await authSession
        .post('/login/dateOfBirth')
        .send({ dobDay: '23', dobMonth: '03', dobYear: '1909', redirect: '/login/success' })
      expect(response.statusCode).toBe(422)
    })

    it('it should return 302 for the right DoB', async () => {
      const response = await authSession
        .post('/login/dateOfBirth')
        .send({ dobDay: '09', dobMonth: '09', dobYear: '1977', redirect: '/login/success' })
      expect(response.statusCode).toBe(302)
    })
  })
})
