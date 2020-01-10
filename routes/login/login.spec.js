const request = require('supertest')
const session = require('supertest-session')
const { extractCsrfToken, withCSRF } = require('../utils.spec')
const cheerio = require('cheerio')
const app = require('../../app.js')

let csrfToken, cookie

beforeEach(async () => {
  const testSession = session(app)
  const getresp = await testSession.get('/login/code')
  cookie = getresp.headers['set-cookie']
  csrfToken = extractCsrfToken(getresp)
})

describe('Test deductions and trillium yesNo page responses', () => {
  const yesNoResponses = [
    {
      url: '/eligibility/children',
      key: 'children',
      yesRedir: '/offramp/children',
      noRedir: '/eligibility/dependents',
    },
    {
      url: '/eligibility/dependents',
      key: 'eligibleDependents',
      yesRedir: '/eligibility/dependents-claim',
      noRedir: '/eligibility/tuition',
    },
    {
      url: '/eligibility/dependents-claim',
      key: 'eligibleDependentsClaim',
      yesRedir: '/offramp/dependents',
      noRedir: '/eligibility/tuition',
    },
    {
      url: '/eligibility/tuition',
      key: 'tuition',
      yesRedir: '/eligibility/tuition-claim',
      noRedir: '/eligibility/income',
    },
    {
      url: '/eligibility/tuition-claim',
      key: 'tuitionClaim',
      yesRedir: '/offramp/tuition',
      noRedir: '/eligibility/income',
    },
    {
      url: '/eligibility/income',
      key: 'income',
      yesRedir: '/offramp/income',
      noRedir: '/login/code',
    },
  ]

  yesNoResponses.map(yesNoResponse => {
    describe(`Test ${yesNoResponse.url} responses`, () => {
      test('it returns a 200 response', async () => {
        const response = await request(app).get(yesNoResponse.url)
        expect(response.statusCode).toBe(200)
      })

      test('it returns a 422 response for no posted value', async () => {
        const response = await request(app)
          .post(yesNoResponse.url)
          .use(withCSRF(cookie, csrfToken))
          .send({ redirect: '/start' })
        expect(response.statusCode).toBe(422)
      })

      const badValues = ['', null, false, 0, 'dinosaur', 'yes']
      badValues.map(badValue => {
        test(`it returns a 422 for a bad posted value: "${badValue}"`, async () => {
          const response = await request(app)
            .post(yesNoResponse.url)
            .use(withCSRF(cookie, csrfToken))
            .send({ [yesNoResponse.key]: badValue, redirect: '/start' })
          expect(response.statusCode).toBe(422)
        })
      })

      test('it redirects to the posted redirect url when posting "No"', async () => {
        const response = await request(app)
          .post(yesNoResponse.url)
          .use(withCSRF(cookie, csrfToken))
          .send({ [yesNoResponse.key]: 'No', redirect: yesNoResponse.noRedir || '/start' })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toEqual(yesNoResponse.noRedir || '/start')
      })

      test('it redirects to the next page when posting "Yes"', async () => {
        const response = await request(app)
          .post(yesNoResponse.url)
          .use(withCSRF(cookie, csrfToken))
          .send({
            [yesNoResponse.key]: 'Yes',
            redirect: yesNoResponse.yesRedir,
          })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toEqual(yesNoResponse.yesRedir)
      })
    })
  })
})

describe('Test /login responses', () => {
  beforeEach(async () => {
    const testSession = session(app)
    const getresp = await testSession.get('/login/code')
    cookie = getresp.headers['set-cookie']
    csrfToken = extractCsrfToken(getresp)
  })

  const urls = ['/login/code', '/login/sin', '/login/dateOfBirth']
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
        .send({ sin: '540 739 869' })
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
        expect($('.validation-message').text()).toEqual('Error: Please enter a SIN')
        expect($('#sin').attr('aria-describedby')).toEqual('sin-error')
      })
    })

    test('it does not allow a SIN with non-numbers', async () => {
      const response = await request(app)
        .post('/login/sin')
        .use(withCSRF(cookie, csrfToken))
        .send({ sin: '123 456 78W', redirect: '/start' })
      expect(response.statusCode).toBe(422)
    })

    test('it does not allow a SIN more than 9 characters', async () => {
      const response = await request(app)
        .post('/login/sin')
        .use(withCSRF(cookie, csrfToken))
        .send({ sin: '12345678910', redirect: '/start' })
      expect(response.statusCode).toBe(422)
    })

    test('it does not allow a SIN less than 9 characters', async () => {
      const response = await request(app)
        .post('/login/sin')
        .use(withCSRF(cookie, csrfToken))
        .send({ sin: '12345678', redirect: '/start' })
      expect(response.statusCode).toBe(422)
    })

    test('it does not allow an invalid SIN', async () => {
      const response = await request(app)
        .post('/login/sin')
        .use(withCSRF(cookie, csrfToken))
        .send({ sin: '847339283', redirect: '/start' })
      expect(response.statusCode).toBe(422)
    })

    test('it returns a 302 response if the SIN format is good', async () => {
      const response = await request(app)
        .post('/login/sin')
        .use(withCSRF(cookie, csrfToken))
        .send({ sin: '117 166 934', redirect: '/start' })
      expect(response.statusCode).toBe(302)
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
          ...{ dobDay: '32', dobMonth: '02', dobYear: '2019' },
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
      // need an auth session with a code / sin
      let authSession
      beforeEach(async () => {
        authSession = session(app)
        const getresp = await authSession.get('/login/code')
        cookie = getresp.headers['set-cookie']
        csrfToken = extractCsrfToken(getresp)

        const response = await authSession
          .post('/login/code')
          .use(withCSRF(cookie, csrfToken))
          .send({
            code: 'A5G98S4K1',
            redirect: '/login/sin',
          })
          .then(() => {
            return authSession
              .post('/login/sin')
              .use(withCSRF(cookie, csrfToken))
              .send({
                sin: '540739869',
                redirect: '/login/dateOfBirth',
              })
          })
        expect(response.statusCode).toBe(302)
      })

      badDoBRequests.map(badRequest => {
        test(`it returns a 422 with: "${badRequest.label}"`, async () => {
          const response = await authSession
            .post('/login/dateOfBirth')
            .use(withCSRF(cookie, csrfToken))
            .send({ ...badRequest.send })
          expect(response.statusCode).toBe(422)
        })
      })

      test('it returns a 302 to the /personal/name page with valid dob', async () => {
        const response = await authSession
          .post('/login/dateOfBirth')
          .use(withCSRF(cookie, csrfToken))
          .send({ ...goodDoBRequest })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/personal/name')
      })

      test('it returns a 302 to the /personal/name with valid dob even with whitespace included', async () => {
        const response = await authSession
          .post('/login/dateOfBirth')
          .use(withCSRF(cookie, csrfToken))
          .send({
            dobDay: ' 9 ',
            dobMonth: ' 9 ',
            dobYear: ' 1977 ',
            redirect: '/personal/name',
          })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/personal/name')
      })
      test('it returns a 302 to the /login/error/doesNotMatch page with a dob that does not match the access code', async () => {
        const response = await authSession
          .post('/login/dateOfBirth')
          .use(withCSRF(cookie, csrfToken))
          .send({
            dobDay: '8',
            dobMonth: '8',
            dobYear: '1970',
            redirect: '/personal/name',
          })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/login/error/doesNotMatch')
      })
    })
  })
  describe('for login error pages', () => {
    test('it returns a 200 response', async () => {
      const response = await request(app).get('/login/error/doesNotMatch')
      expect(response.statusCode).toBe(200)
    })
  })
})
