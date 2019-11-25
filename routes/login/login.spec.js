const request = require('supertest')
const session = require('supertest-session')
const { extractCsrfToken, withCSRF } = require('../utils.spec')
const cheerio = require('cheerio')
const app = require('../../app.js')

let csrfToken, cookie

describe('Test /login responses', () => {
  beforeEach(async () => {
    const testSession = session(app)
    const getresp = await testSession.get('/login/code')
    cookie = getresp.headers['set-cookie']
    csrfToken = extractCsrfToken(getresp)
  })

  const urls = [
    '/login/code',
    '/login/sin',
    '/login/dateOfBirth',
    '/login/securityQuestion',
    '/login/questions/child',
    '/login/questions/trillium',
    '/login/questions/addresses',
    '/login/questions/bankruptcy',
    '/login/questions/dateOfResidence',
    '/login/questions/bank',
  ]
  urls.map(url => {
    test(`it returns a 200 response for ${url}`, async () => {
      const response = await request(app).get(url)
      expect(response.statusCode).toBe(200)
    })

    test(`it returns a 422 response for ${url} if nothing is posted`, async () => {
      const response = await request(app)
        .post(url)
        .use(withCSRF(cookie, csrfToken))
      expect(response.statusCode).toBe(422)
    })

    test(`it returns a 422 response for ${url} if only a redirect is posted`, async () => {
      const response = await request(app)
        .post(url)
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/start' })
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
      .use(withCSRF(cookie, csrfToken))
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
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/start' })
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
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/start' })
      const $ = cheerio.load(response.text)
      expect($('.validation-message').text()).toEqual('Error: Access code must be 9 characters')
      expect($('#code').attr('aria-describedby')).toEqual('code-error')
    })
  })

  test('it does not allow a code more than 9 characters', async () => {
    const response = await request(app)
      .post('/login/code')
      .use(withCSRF(cookie, csrfToken))
      .send({ code: '23XGY12111', redirect: '/start' })
    expect(response.statusCode).toBe(422)
  })

  test('it does not allow a code less than 8 characters', async () => {
    const response = await request(app)
      .post('/login/code')
      .use(withCSRF(cookie, csrfToken))
      .send({ code: 'A23X', redirect: '/start' })
    expect(response.statusCode).toBe(422)
  })

  test('it does not allow non-alphanumeric characters', async () => {
    const response = await request(app)
      .post('/login/code')
      .use(withCSRF(cookie, csrfToken))
      .send({ code: 'A23X456@', redirect: '/start' })
    expect(response.statusCode).toBe(422)
  })

  test('it does not allow a mixed-case code', async () => {
    const response = await request(app)
      .post('/login/code')
      .use(withCSRF(cookie, csrfToken))
      .send({ code: 'a5G98s4K1', redirect: '/start' })
    expect(response.statusCode).toBe(422)
  })

  const codes = ['A5G98S4K1', 'a5g98s4k1'] //check uppercase, lowercase
  codes.map(code => {
    test(`it redirects if a valid code is provided: "${code}"`, async () => {
      const response = await request(app)
        .post('/login/code')
        .use(withCSRF(cookie, csrfToken))
        .send({ code, redirect: '/start' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/start')
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
        .use(withCSRF(cookie, csrfToken))
        .send({ sin: '847 339 283' })
      expect(response.statusCode).toBe(500)
    })

    test('it reloads /login/sin with a 422 status if no sin is provided', async () => {
      const response = await request(app)
        .post('/login/sin')
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/start' })
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
          .use(withCSRF(cookie, csrfToken))
          .send({ redirect: '/start' })
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
        .use(withCSRF(cookie, csrfToken))
        .send({ code: '12345678910', redirect: '/start' })
      expect(response.statusCode).toBe(422)
    })

    test('it does not allow a code less than 9 characters', async () => {
      const response = await request(app)
        .post('/login/sin')
        .use(withCSRF(cookie, csrfToken))
        .send({ code: '12345678', redirect: '/start' })
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
        const getresp = await authSession.get('/login/code')
        cookie = getresp.headers['set-cookie']
        csrfToken = extractCsrfToken(getresp)

        const response = await authSession
          .post('/login/code')
          .use(withCSRF(cookie, csrfToken))
          .send({ code: 'A5G98S4K1', redirect: '/login/sin' })
        expect(response.statusCode).toBe(302)
      })

      it('it should return 422 for the wrong SIN', async () => {
        const response = await authSession
          .post('/login/sin')
          .use(withCSRF(cookie, csrfToken))
          .send({ sin: '123456789', redirect: '/login/sin' })
        expect(response.statusCode).toBe(422)
      })

      it('it should return 302 for the right SIN', async () => {
        const response = await authSession
          .post('/login/sin')
          .use(withCSRF(cookie, csrfToken))
          .send({ sin: '847 339 283', redirect: '/login/sin' })
        expect(response.statusCode).toBe(302)
      })
    })
  })

  describe('Test date of birth responses', () => {
    let goodDoBRequest = {
      dobDay: '09',
      dobMonth: '09',
      dobYear: '1977',
      redirect: '/personal/name',
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
            dobYear: currentDate.getFullYear() - 201,
          },
        },
      },
    ]

    describe('for /login/dateOfBirth', () => {
      badDoBRequests.map(badRequest => {
        test(`it returns a 422 with: "${badRequest.label}"`, async () => {
          const response = await request(app)
            .post('/login/dateOfBirth')
            .use(withCSRF(cookie, csrfToken))
            .send({ ...badRequest.send })
          expect(response.statusCode).toBe(422)
        })
      })

      test('it returns a 302 with valid dob', async () => {
        const response = await request(app)
          .post('/login/dateOfBirth')
          .use(withCSRF(cookie, csrfToken))
          .send({ ...goodDoBRequest })
        expect(response.statusCode).toBe(302)
      })

      test('it returns a 302 with valid dob even with whitespace included', async () => {
        const response = await request(app)
          .post('/login/dateOfBirth')
          .use(withCSRF(cookie, csrfToken))
          .send({
            dobDay: ' 9 ',
            dobMonth: ' 9 ',
            dobYear: ' 1977 ',
            redirect: '/personal/name',
          })
        expect(response.statusCode).toBe(302)
      })
    })

    describe('for /login/questions/child', () => {
      beforeEach(async () => {
        const testSession = session(app)
        const getresp = await testSession.get('/login/questions/child')
        cookie = getresp.headers['set-cookie']
        csrfToken = extractCsrfToken(getresp)
      })

      badDoBRequests.map(badRequest => {
        test(`it returns a 422 with a valid lastName but a bad date: "${badRequest.label}"`, async () => {
          const response = await request(app)
            .post('/login/questions/child')
            .use(withCSRF(cookie, csrfToken))
            .send({ ...badRequest.send, ...{ childLastName: 'Laika' } })
          expect(response.statusCode).toBe(422)
        })
      })

      test('it returns a 422 with valid dob but NO last name', async () => {
        const response = await request(app)
          .post('/login/questions/child')
          .use(withCSRF(cookie, csrfToken))
          .send({ ...goodDoBRequest, ...{ childLastName: '' } })
        expect(response.statusCode).toBe(422)
      })

      test('it returns a 422 with NO dob but valid last name', async () => {
        const response = await request(app)
          .post('/login/questions/child')
          .use(withCSRF(cookie, csrfToken))
          .send({ childLastName: 'Laika' })
        expect(response.statusCode).toBe(422)
      })

      test('it returns a 302 with valid dob and last name', async () => {
        const response = await request(app)
          .post('/login/questions/child')
          .use(withCSRF(cookie, csrfToken))
          .send({ ...goodDoBRequest, ...{ childLastName: 'Laika' } })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toEqual('/personal/name')
      })
    })

    describe('for /login/questions/prison', () => {
      badDoBRequests.map(badRequest => {
        test(`it returns a 422 with a valid prisonDate but a bad date: "${badRequest.label}"`, async () => {
          const response = await request(app)
            .post('/login/questions/prison')
            .use(withCSRF(cookie, csrfToken))
            .send({ ...badRequest.send, ...{ prisonDate: 'release' } })
          expect(response.statusCode).toBe(422)
        })
      })

      test('it returns a 422 with valid dob but NO selected prisonDate', async () => {
        const response = await request(app)
          .post('/login/questions/prison')
          .use(withCSRF(cookie, csrfToken))
          .send({ ...goodDoBRequest, ...{ prisonDate: '' } })
        expect(response.statusCode).toBe(422)
      })

      test('it returns a 422 with valid dob but an invalid prisonDate', async () => {
        const response = await request(app)
          .post('/login/questions/prison')
          .use(withCSRF(cookie, csrfToken))
          .send({ ...goodDoBRequest, ...{ prisonDate: 'jailbreak' } })
        expect(response.statusCode).toBe(422)
      })

      test('it returns a 422 with NO date entered but a valid prisonDate', async () => {
        const response = await request(app)
          .post('/login/questions/prison')
          .use(withCSRF(cookie, csrfToken))
          .send({ prisonDate: 'release' })
        expect(response.statusCode).toBe(422)
      })

      test('it returns a 302 with valid dob and prisonDate', async () => {
        const response = await request(app)
          .post('/login/questions/prison')
          .use(withCSRF(cookie, csrfToken))
          .send({ ...goodDoBRequest, ...{ prisonDate: 'release' } })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toEqual('/personal/name')
      })
    })

    describe('for /login/questions/dateOfResidence', () => {
      badDoBRequests.map(badRequest => {
        test(`it returns a 422 with: "${badRequest.label}"`, async () => {
          const response = await request(app)
            .post('/login/questions/dateOfResidence')
            .use(withCSRF(cookie, csrfToken))
            .send({ ...badRequest.send })
          expect(response.statusCode).toBe(422)
        })
      })

      test('it returns a 302 with valid dob', async () => {
        const response = await request(app)
          .post('/login/questions/dateOfResidence')
          .use(withCSRF(cookie, csrfToken))
          .send({ ...goodDoBRequest })
        expect(response.statusCode).toBe(302)
      })
    })

    describe('for /login/questions/bankruptcy', () => {
      badDoBRequests.map(badRequest => {
        test(`it returns a 422 with: "${badRequest.label}"`, async () => {
          const response = await request(app)
            .post('/login/questions/bankruptcy')
            .use(withCSRF(cookie, csrfToken))
            .send({ ...badRequest.send })
          expect(response.statusCode).toBe(422)
        })
      })

      test('it returns a 422 with valid dob but NO last name', async () => {
        const response = await request(app)
          .post('/login/questions/bankruptcy')
          .use(withCSRF(cookie, csrfToken))
          .send({ ...goodDoBRequest, ...{ trusteeLastName: '' } })
        expect(response.statusCode).toBe(422)
      })

      test('it returns a 422 with NO dob but valid last name', async () => {
        const response = await request(app)
          .post('/login/questions/bankruptcy')
          .use(withCSRF(cookie, csrfToken))
          .send({ trusteeLastName: 'Loblaw' })
        expect(response.statusCode).toBe(422)
      })

      test('it returns a 302 with valid dob and last name', async () => {
        const response = await request(app)
          .post('/login/questions/bankruptcy')
          .use(withCSRF(cookie, csrfToken))
          .send({ ...goodDoBRequest, ...{ trusteeLastName: 'Loblaw' } })
        expect(response.statusCode).toBe(302)
      })
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
      const getresp = await authSession.get('/login/code')
      cookie = getresp.headers['set-cookie']
      csrfToken = extractCsrfToken(getresp)

      const response = await authSession
        .post('/login/code')
        .use(withCSRF(cookie, csrfToken))
        .send({ code: 'A5G98S4K1', redirect: '/login/sin' })
        .then(() => {
          return authSession
            .post('/login/sin')
            .use(withCSRF(cookie, csrfToken))
            .send({ sin: '847339283', redirect: '/login/dateOfBirth' })
        })
      expect(response.statusCode).toBe(302)
    })

    it('it should return 422 for the wrong DoB', async () => {
      const response = await authSession
        .post('/login/dateOfBirth')
        .use(withCSRF(cookie, csrfToken))
        .send({
          dobDay: '23',
          dobMonth: '03',
          dobYear: '1909',
          redirect: '/personal/name',
        })
      expect(response.statusCode).toBe(422)
    })

    it('it should return 302 for the right DoB', async () => {
      const response = await authSession
        .post('/login/dateOfBirth')
        .use(withCSRF(cookie, csrfToken))
        .send({
          dobDay: '09',
          dobMonth: '09',
          dobYear: '1977',
          redirect: '/personal/name',
        })
      expect(response.statusCode).toBe(302)
    })
  })
})

const questionsAmounts = [
  {
    url: '/login/questions/trillium',
    key: 'trillium',
  },
]

questionsAmounts.map(amountResponse => {
  describe(`Test ${amountResponse.url} responses`, () => {
    beforeEach(async () => {
      const testSession = session(app)
      const getresp = await testSession.get(amountResponse.url)
      cookie = getresp.headers['set-cookie']
      csrfToken = extractCsrfToken(getresp)
    })
    test('it returns a 200 response', async () => {
      const response = await request(app).get(amountResponse.url)
      expect(response.statusCode).toBe(200)
    })

    test('it returns a 422 response if no redirect is provided', async () => {
      const response = await request(app)
        .post(amountResponse.url)
        .use(withCSRF(cookie, csrfToken))
      expect(response.statusCode).toBe(422)
    })

    test('it returns a 422 response for no posted values', async () => {
      const response = await request(app)
        .post(amountResponse.url)
        .use(withCSRF(cookie, csrfToken))
        .send({ redirect: '/start' })
      expect(response.statusCode).toBe(422)
    })

    const badAmounts = ['dinosaur', '10.0', '10.000', '-10', '.1']
    badAmounts.map(badAmount => {
      test(`it returns a 422 for a bad posted amount: "${badAmount}"`, async () => {
        const response = await request(app)
          .post(amountResponse.url)
          .use(withCSRF(cookie, csrfToken))
          .send({
            [`${amountResponse.key}Amount`]: badAmount,
            [`${amountResponse.key}PaymentMethod`]: 'cheque',
            redirect: '/start',
          })
        expect(response.statusCode).toBe(422)
      })
    })

    test('it returns a 422 response for a good amount but NO payment method', async () => {
      const response = await request(app)
        .post(amountResponse.url)
        .use(withCSRF(cookie, csrfToken))
        .send({ [`${amountResponse.key}Amount`]: '10', redirect: '/start' })
      expect(response.statusCode).toBe(422)
    })

    const goodAmounts = ['0', '10', '10.00', '.10', '', null]
    goodAmounts.map(goodAmount => {
      test(`it returns a 302 for a good posted amount: "${goodAmount}"`, async () => {
        const response = await request(app)
          .post(amountResponse.url)
          .use(withCSRF(cookie, csrfToken))
          .send({
            [`${amountResponse.key}Amount`]: goodAmount,
            [`${amountResponse.key}PaymentMethod`]: 'cheque',
            redirect: '/start',
          })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toEqual('/start')
      })
    })

    test('it returns a 302 response for NO amount but a good payment method', async () => {
      const response = await request(app)
        .post(amountResponse.url)
        .use(withCSRF(cookie, csrfToken))
        .send({
          [`${amountResponse.key}PaymentMethod`]: 'cheque',
          redirect: '/start',
        })
      expect(response.statusCode).toBe(302)
    })

    test('it returns a 422 response for a good amount but a BAD payment method', async () => {
      const response = await request(app)
        .post(amountResponse.url)
        .use(withCSRF(cookie, csrfToken))
        .send({
          [`${amountResponse.key}Amount`]: '10',
          [`${amountResponse.key}PaymentMethod`]: 'bitcoin',
          redirect: '/start',
        })
      expect(response.statusCode).toBe(422)
    })

    const goodPaymentMethods = ['cheque', 'directDeposit']
    goodPaymentMethods.map(paymentMethod => {
      test(`it returns a 302 for a good posted payment method: "${paymentMethod}"`, async () => {
        const response = await request(app)
          .post(amountResponse.url)
          .use(withCSRF(cookie, csrfToken))
          .send({
            [`${amountResponse.key}Amount`]: '10',
            [`${amountResponse.key}PaymentMethod`]: paymentMethod,
            redirect: '/start',
          })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toEqual('/start')
      })
    })
  })
})

describe('Test securityQuestion responses', () => {
  beforeEach(async () => {
    const testSession = session(app)
    const getresp = await testSession.get('/login/securityQuestion')
    cookie = getresp.headers['set-cookie']
    csrfToken = extractCsrfToken(getresp)
  })

  const securityQuestionPages = ['/login/securityQuestion', '/login/securityQuestion2']

  securityQuestionPages.map(securityQuestionPage => {
    test('it returns a 422 response when posting a bad value', async () => {
      const response = await request(app)
        .post(securityQuestionPage)
        .use(withCSRF(cookie, csrfToken))
        .send({ securityQuestion: '/login/question/who-let-the-dogs-out' })
      expect(response.statusCode).toBe(422)
    })

    const securityQuestionUrls = ['/login/questions/child', '/login/questions/trillium']
    securityQuestionUrls.map(url => {
      test(`it returns a 302 response when posting a good value: ${url}`, async () => {
        const response = await request(app)
          .post(securityQuestionPage)
          .use(withCSRF(cookie, csrfToken))
          .send({ securityQuestion: url })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toEqual(url)
      })
    })
  })
})

describe('Test /login/questions/addresses responses', () => {
  beforeEach(async () => {
    const testSession = session(app)
    const getresp = await testSession.get('/login/questions/addresses')
    cookie = getresp.headers['set-cookie']
    csrfToken = extractCsrfToken(getresp)
  })

  let goodRequest = {
    firstStreetAddress: 'Awesome Avenue',
    firstCity: 'Awesawa',
    firstPostalCode: 'H3L1Y4',
    firstProvince: 'Ontario',
    secondStreetAddress: 'Oh no cul-de-sac',
    secondCity: 'Yikesville',
    secondPostalCode: 'H0N0N0',
    secondProvince: 'Ontario',
    redirect: '/personal/name',
  }

  const badRequests = [
    {
      label: 'no streetAddress or city or firstPostalCode or province',
      firstErrorId: '#firstStreetAddress',
      send: {
        ...goodRequest,
        ...{ firstStreetAddress: '', firstCity: '', firstPostalCode: '', firstProvince: '' },
      },
    },
    {
      label: 'no streetAddress',
      firstErrorId: '#firstStreetAddress',
      send: {
        ...goodRequest,
        ...{ firstStreetAddress: '' },
      },
    },
    {
      label: 'no city',
      firstErrorId: '#firstCity',
      send: {
        ...goodRequest,
        ...{ firstCity: '' },
      },
    },
    {
      label: 'no postalCode',
      firstErrorId: '#firstPostalCode',
      send: {
        ...goodRequest,
        ...{ firstPostalCode: '' },
      },
    },
    {
      label: 'bad postalCode',
      firstErrorId: '#firstPostalCode',
      send: {
        ...goodRequest,
        ...{ firstPostalCode: '0h3 N03' },
      },
    },
    {
      label: 'no province',
      firstErrorId: '#firstProvince',
      send: {
        ...goodRequest,
        ...{ firstProvince: '' },
      },
    },
    {
      label: 'bad province',
      firstErrorId: '#firstProvince',
      send: {
        ...goodRequest,
        ...{ firstProvince: 'Aurora' },
      },
    },
  ]

  badRequests.map(badRequest => {
    test(`it returns a 422 with: "${badRequest.label}"`, async () => {
      const response = await request(app)
        .post('/login/questions/addresses')
        .use(withCSRF(cookie, csrfToken))
        .send({ ...badRequest.send })
      expect(response.statusCode).toBe(422)
    })
  })

  test('it returns a 302 for a good request', async () => {
    const response = await request(app)
      .post('/login/questions/addresses')
      .use(withCSRF(cookie, csrfToken))
      .send({ ...goodRequest })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/personal/name')
  })
})

describe('Test /login/questions/bank responses', () => {
  beforeEach(async () => {
    const testSession = session(app)
    const getresp = await testSession.get('/login/questions/addresses')
    cookie = getresp.headers['set-cookie']
    csrfToken = extractCsrfToken(getresp)
  })

  let goodRequest = {
    branchNumber: '12345',
    institutionNumber: '123',
    accountNumber: '111222333444',
  }

  const badRequests = [
    {
      label: 'no branchNumber',
      firstErrorId: '#branchNumber',
      send: {
        ...goodRequest,
        ...{ branchNumber: '' },
      },
    },
    {
      label: 'bad branchNumber',
      firstErrorId: '#branchNumber',
      send: {
        ...goodRequest,
        // wrong number of chars (needs 5)
        ...{ branchNumber: '1' },
      },
    },
    {
      label: 'no institutionNumber',
      firstErrorId: '#institutionNumber',
      send: {
        ...goodRequest,
        ...{ institutionNumber: '' },
      },
    },
    {
      label: 'bad institutionNumber',
      firstErrorId: '#institutionNumber',
      send: {
        ...goodRequest,
        // wrong number of chars (needs 3)
        ...{ institutionNumber: '1' },
      },
    },
    {
      label: 'no accountNumber',
      firstErrorId: '#accountNumber',
      send: {
        ...goodRequest,
        ...{ accountNumber: '' },
      },
    },
    {
      label: 'bad accountNumber',
      firstErrorId: '#accountNumber',
      send: {
        ...goodRequest,
        // wrong number of chars (needs 12)
        ...{ accountNumber: '1' },
      },
    },
  ]

  badRequests.map(badRequest => {
    test(`it returns a 422 with: "${badRequest.label}"`, async () => {
      const response = await request(app)
        .post('/login/questions/bank')
        .use(withCSRF(cookie, csrfToken))
        .send({ ...badRequest.send })

      const $ = cheerio.load(response.text)
      expect(
        $('.error-list__link')
          .first()
          .attr('href'),
      ).toEqual(badRequest.firstErrorId)
      expect(response.statusCode).toBe(422)
    })
  })

  test('it returns a 302 for a good request', async () => {
    const response = await request(app)
      .post('/login/questions/bank')
      .use(withCSRF(cookie, csrfToken))
      .send({ ...goodRequest, redirect: '/personal/name' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/personal/name')
  })
})

describe('Test /login/questions/taxReturn responses', () => {
  beforeEach(async () => {
    const testSession = session(app)
    const getresp = await testSession.get('/login/questions/taxReturn')
    cookie = getresp.headers['set-cookie']
    csrfToken = extractCsrfToken(getresp)
  })

  let goodRequest = {
    taxReturnYear: '2018',
    taxReturnAmount: '10000',
  }

  const badRequests = [
    {
      label: 'no taxReturnYear',
      firstErrorId: '#taxReturnYear',
      send: {
        ...goodRequest,
        ...{ taxReturnYear: '' },
      },
    },
    {
      label: 'bad taxReturnYear',
      firstErrorId: '#taxReturnYear',
      send: {
        ...goodRequest,
        ...{ taxReturnYear: '20' },
      },
    },
    {
      label: 'no taxReturnAmount',
      firstErrorId: '#taxReturnAmount',
      send: {
        ...goodRequest,
        ...{ taxReturnAmount: '' },
      },
    },
    {
      label: 'bad taxReturnAmount',
      firstErrorId: '#taxReturnAmount',
      send: {
        ...goodRequest,
        ...{ taxReturnAmount: 'abcd' },
      },
    },
  ]

  badRequests.map(badRequest => {
    test(`it returns a 422 with: "${badRequest.label}"`, async () => {
      const response = await request(app)
        .post('/login/questions/taxReturn')
        .use(withCSRF(cookie, csrfToken))
        .send({ ...badRequest.send })

      const $ = cheerio.load(response.text)
      expect(
        $('.error-list__link')
          .first()
          .attr('href'),
      ).toEqual(badRequest.firstErrorId)
      expect(response.statusCode).toBe(422)
    })
  })

  test('it returns a 302 for a good request', async () => {
    const response = await request(app)
      .post('/login/questions/taxReturn')
      .use(withCSRF(cookie, csrfToken))
      .send({ ...goodRequest, redirect: '/personal/name' })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/personal/name')
  })
})
