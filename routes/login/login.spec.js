const request = require('supertest')
const session = require('supertest-session')
const cheerio = require('cheerio')
const app = require('../../app.js')

describe('Test /login responses', () => {
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
  ]
  
  urls.map(url => {
    test(`it returns a 200 response for ${url}`, async () => {
      const response = await request(app).get(url)
      expect(response.statusCode).toBe(200)
    })

    test(`it returns a 422 response for ${url} if nothing is posted`, async () => {
      request(app)
        .get(url)
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post(url)
            .send({_csrf: csrfToken})
          expect(response.statusCode).toBe(422)
        })
    })

    test(`it returns a 422 response for ${url} if only a redirect is posted`, async () => {
      request(app)
        .get(url)
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post(url)
            .send({ redirect: '/start', _csrf: csrfToken })
          expect(response.statusCode).toBe(422)
        })
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
    request(app)
      .get('/login/code')
      .expect(200)
      .end(async function(err, res) {
        var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
        const response = await request(app)
          .post('/login/code')
          .send({ code: 'A5G98S4K1', _csrf: csrfToken })
        expect(response.statusCode).toBe(500)
      })
  })

  test('it autofocuses on the single input on the page', async () => {
    const response = await request(app).get('/login/code')
    const $ = cheerio.load(response.text)
    expect($('#code').attr('autofocus')).toEqual('autofocus')
  })

  describe('Error list tests', () => {
    test('it renders the error-list for /login/code', async () => {
      request(app)
        .get('/login/code')
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post('/login/code')
            .send({ redirect: '/start', _csrf: csrfToken })
          const $ = cheerio.load(response.text)
          expect($('title').text()).toMatch(/^Error:/)
          expect($('.error-list__header').text()).toEqual('Please correct the errors on the page')
          expect($('.error-list__list').children()).toHaveLength(1)
          expect($('.validation-message').text()).toEqual('Error: Access code must be 9 characters')
          expect($('#code').attr('aria-describedby')).toEqual('code-error')
          expect($('#code').attr('autofocus')).toEqual('autofocus')
        })
    })

    test('it renders an inline error for /login/code with appropriate describedby', async () => {
      request(app)
        .get('/login/code')
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post('/login/code')
            .send({ redirect: '/start', _csrf: csrfToken })
          const $ = cheerio.load(response.text)
          expect($('.validation-message').text()).toEqual('Error: Access code must be 9 characters')
          expect($('#code').attr('aria-describedby')).toEqual('code-error')
        })
    })
  })

  test('it does not allow a code more than 9 characters', async () => {
    request(app)
      .get('/login/code')
      .expect(200)
      .end(async function(err, res) {
        var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
        const response = await request(app)
          .post('/login/code')
          .send({ code: '23XGY12111', redirect: '/start', _csrf: csrfToken })
        expect(response.statusCode).toBe(422)
      })
  })

  test('it does not allow a code less than 8 characters', async () => {
    request(app)
      .get('/login/code')
      .expect(200)
      .end(async function(err, res) {
        var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
        const response = await request(app)
          .post('/login/code')
          .send({ code: 'A23X', redirect: '/start', _csrf: csrfToken })
        expect(response.statusCode).toBe(422)
      })
  })

  test('it does not allow non-alphanumeric characters', async () => {
    request(app)
      .get('/login/code')
      .expect(200)
      .end(async function(err, res) {
        var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
        const response = await request(app)
          .post('/login/code')
          .send({ code: 'A23X456@', redirect: '/start', _csrf: csrfToken })
        expect(response.statusCode).toBe(422)
      })
  })

  test('it does not allow a mixed-case code', async () => {
    request(app)
      .get('/login/code')
      .expect(200)
      .end(async function(err, res) {
        var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
        const response = await request(app)
          .post('/login/code')
          .send({ code: 'a5G98s4K1', redirect: '/start', _csrf: csrfToken })
        expect(response.statusCode).toBe(422)
      })
  })

  const codes = ['A5G98S4K1', 'a5g98s4k1'] //check uppercase, lowercase
  codes.map(code => {
    test(`it redirects if a valid code is provided: "${code}"`, async () => {
      request(app)
        .get('/login/code')
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post('/login/code')
            .send({ code, redirect: '/start', _csrf: csrfToken })
          expect(response.statusCode).toBe(302)
          expect(response.headers.location).toEqual('/start')
        })
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
      request(app)
        .get('/login/sin')
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post('/login/sin')
            .send({ sin: '847 339 283', _csrf: csrfToken })
          expect(response.statusCode).toBe(500)
        })
    })

    test('it reloads /login/sin with a 422 status if no sin is provided', async () => {
      request(app)
        .get('/login/sin')
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post('/login/sin')
            
            .send({ redirect: '/start', _csrf: csrfToken })
          expect(response.statusCode).toBe(422)
          const $ = cheerio.load(response.text)
          expect($('title').text()).toMatch(/^Error:/)
          expect($('.error-list__header').text()).toEqual('Please correct the errors on the page')
          expect($('.error-list__list').children()).toHaveLength(1)
          expect($('.validation-message').text()).toEqual('Error: Your SIN should have 9 numbers')
          expect($('#sin').attr('aria-describedby')).toEqual('sin-error')
        })
    })

    describe('Error list tests', () => {
      test('it renders the error-list for /login/sin', async () => {
        request(app)
          .get('/login/sin')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/sin')
              
              .send({ redirect: '/start', _csrf: csrfToken })
            const $ = cheerio.load(response.text)
            expect($('title').text()).toMatch(/^Error:/)
            expect($('.error-list__header').text()).toEqual('Please correct the errors on the page')
            expect($('.error-list__list').children()).toHaveLength(1)
            expect($('.validation-message').text()).toEqual('Error: Your SIN should have 9 numbers')
            expect($('#sin').attr('aria-describedby')).toEqual('sin-error')
          })
      })
    })

    test('it does not allow a code more than 9 characters', async () => {
      request(app)
        .get('/login/sin')
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post('/login/sin')
            
            .send({ code: '12345678910', redirect: '/start', _csrf: csrfToken })
          expect(response.statusCode).toBe(422)
        })
    })

    test('it does not allow a code less than 9 characters', async () => {
      request(app)
        .get('/login/sin')
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post('/login/sin')
            
            .send({ code: '12345678', redirect: '/start', _csrf: csrfToken })
          expect(response.statusCode).toBe(422)
        })
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
        authSession
          .get('/login/sin')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await authSession
              .post('/login/code')
              
              .send({ code: 'A5G98S4K1', redirect: '/login/sin', _csrf: csrfToken })
            expect(response.statusCode).toBe(302)
          })
      })

      it('it should return 422 for the wrong SIN', async () => {
        authSession
          .get('/login/sin')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await authSession
              .post('/login/sin')
              
              .send({ sin: '123456789', redirect: '/login/sin', _csrf: csrfToken })
            expect(response.statusCode).toBe(422)
          })
      })

      it('it should return 302 for the right SIN', async () => {
        authSession
          .get('/login/sin')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await authSession
              .post('/login/sin')
              
              .send({ sin: '847 339 283', redirect: '/login/sin', _csrf: csrfToken })
            expect(response.statusCode).toBe(302)
          })
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
          request(app)
            .get('/login/dateOfBirth')
            .expect(200)
            .end(async function(err, res) {
              var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
              const response = await request(app)
                .post('/login/dateOfBirth')
                
                .send({ ...badRequest.send, _csrf: csrfToken })
              expect(response.statusCode).toBe(422)
            })
        })
      })

      test('it returns a 302 with valid dob', async () => {
        request(app)
          .get('/login/dateOfBirth')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/dateOfBirth')
              
              .send({ ...goodDoBRequest, _csrf: csrfToken})
            expect(response.statusCode).toBe(302)
          })
      })

      test('it returns a 302 with valid dob even with whitespace included', async () => {
        request(app)
          .get('/login/dateOfBirth')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/dateOfBirth')
              
              .send({
                dobDay: ' 9 ',
                dobMonth: ' 9 ',
                dobYear: ' 1977 ',
                redirect: '/personal/name',
                _csrf: csrfToken
              })
            expect(response.statusCode).toBe(302)
          });
      })
    })

    describe('for /login/questions/child', () => {
      badDoBRequests.map(badRequest => {
        test(`it returns a 422 with a valid lastName but a bad date: "${badRequest.label}"`, async () => {
          request(app)
            .get('/login/questions/child')
            .expect(200)
            .end(async function(err, res) {
              var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
              const response = await request(app)
                .post('/login/questions/child')
                
                .send({ ...badRequest.send, ...{ childLastName: 'Laika' }, _csrf: csrfToken })
              expect(response.statusCode).toBe(422)
            })
        })
      })

      test('it returns a 422 with valid dob but NO last name', async () => {
        request(app)
          .get('/login/questions/child')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/questions/child')
              
              .send({ ...goodDoBRequest, ...{ childLastName: '' }, _csrf: csrfToken })
            expect(response.statusCode).toBe(422)
          })
      })

      test('it returns a 422 with NO dob but valid last name', async () => {
        request(app)
          .get('/login/questions/child')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/questions/child')
              
              .send({ childLastName: 'Laika', _csrf: csrfToken })
            expect(response.statusCode).toBe(422)
          })
      })

      test('it returns a 302 with valid dob and last name', async () => {
        request(app)
          .get('/login/questions/child')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/questions/child')
              
              .send({ ...goodDoBRequest, ...{ childLastName: 'Laika' }, _csrf: csrfToken })
            expect(response.statusCode).toBe(302)
            expect(response.headers.location).toEqual('/personal/name')
          })
      })
    })

    describe('for /login/questions/prison', () => {
      badDoBRequests.map(badRequest => {
        test(`it returns a 422 with a valid prisonDate but a bad date: "${badRequest.label}"`, async () => {
          request(app)
            .get('/login/questions/prison')
            .expect(200)
            .end(async function(err, res) {
              var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
              const response = await request(app)
                .post('/login/questions/prison')
                
                .send({ ...badRequest.send, ...{ prisonDate: 'release' }, _csrf: csrfToken })
              expect(response.statusCode).toBe(422)
            })
        })
      })

      test('it returns a 422 with valid dob but NO selected prisonDate', async () => {
        request(app)
          .get('/login/questions/prison')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/questions/prison')
              
              .send({ ...goodDoBRequest, ...{ prisonDate: '' }, _csrf: csrfToken })
            expect(response.statusCode).toBe(422)
          })
      })

      test('it returns a 422 with valid dob but an invalid prisonDate', async () => {
        request(app)
          .get('/login/questions/prison')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/questions/prison')
              
              .send({ ...goodDoBRequest, ...{ prisonDate: 'jailbreak' }, _csrf: csrfToken })
            expect(response.statusCode).toBe(422)
          });
      })

      test('it returns a 422 with NO date entered but a valid prisonDate', async () => {
        request(app)
          .get('/login/questions/prison')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/questions/prison')
              
              .send({ prisonDate: 'release', _csrf: csrfToken })
            expect(response.statusCode).toBe(422)
          })
      })

      test('it returns a 302 with valid dob and prisonDate', async () => {
        request(app)
          .get('/login/questions/prison')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/questions/prison')
              
              .send({ ...goodDoBRequest, ...{ prisonDate: 'release' }, _csrf: csrfToken })
            expect(response.statusCode).toBe(302)
            expect(response.headers.location).toEqual('/personal/name')
          })
      })
    })

    describe('for /login/questions/dateOfResidence', () => {
      badDoBRequests.map(badRequest => {
        test(`it returns a 422 with: "${badRequest.label}"`, async () => {
          request(app)
            .get('/login/questions/dateOfResidence')
            .expect(200)
            .end(async function(err, res) {
              var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
              const response = await request(app)
                .post('/login/questions/dateOfResidence')
                
                .send({ ...badRequest.send, _csrf: csrfToken })
              expect(response.statusCode).toBe(422)
            })
        })
      })

      test('it returns a 302 with valid dob', async () => {
        request(app)
          .get('/login/questions/dateOfResidence')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/questions/dateOfResidence')
              
              .send({ ...goodDoBRequest, _csrf: csrfToken})
            expect(response.statusCode).toBe(302)
          })
      })
    })

    describe('for /login/questions/bankruptcy', () => {
      badDoBRequests.map(badRequest => {
        test(`it returns a 422 with: "${badRequest.label}"`, async () => {
          request(app)
            .get('/login/questions/bankruptcy')
            .expect(200)
            .end(async function(err, res) {
              var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
              const response = await request(app)
                .post('/login/questions/bankruptcy')
                
                .send({ ...badRequest.send, _csrf: csrfToken })
              expect(response.statusCode).toBe(422)
            })
        })
      })

      test('it returns a 422 with valid dob but NO last name', async () => {
        request(app)
          .get('/login/questions/bankruptcy')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/questions/bankruptcy')
              
              .send({ ...goodDoBRequest, ...{ trusteeLastName: '' }, _csrf: csrfToken })
            expect(response.statusCode).toBe(422)
          })
      })

      test('it returns a 422 with NO dob but valid last name', async () => {
        request(app)
          .get('/login/questions/bankruptcy')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/questions/bankruptcy')
              
              .send({ trusteeLastName: 'Loblaw', _csrf: csrfToken })
            expect(response.statusCode).toBe(422)
          })
      })

      test('it returns a 302 with valid dob and last name', async () => {
        request(app)
          .get('/login/questions/bankruptcy')
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post('/login/questions/bankruptcy')
              
              .send({ ...goodDoBRequest, ...{ trusteeLastName: 'Loblaw' }, _csrf: csrfToken })
            expect(response.statusCode).toBe(302)
          })
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
      authSession
        .get('/login/code')
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await authSession
            .post('/login/code')
            
            .send({ code: 'A5G98S4K1', redirect: '/login/sin', _csrf: csrfToken })
            .then(() => {
              return authSession
                .post('/login/sin')
                .send({ sin: '847339283', redirect: '/login/dateOfBirth' })
            })
          expect(response.statusCode).toBe(302)
        })
    })

    it('it should return 422 for the wrong DoB', async () => {
      authSession
        .get('/login/dateOfBirth')
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await authSession
            .post('/login/dateOfBirth')
            
            .send({ dobDay: '23', dobMonth: '03', dobYear: '1909', redirect: '/personal/name', _csrf: csrfToken })
          expect(response.statusCode).toBe(422)
        })
    })

    it('it should return 302 for the right DoB', async () => {
      request(app)
        .get('/login/dateOfBirth')
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await authSession
            .post('/login/dateOfBirth')
            
            .send({ dobDay: '09', dobMonth: '09', dobYear: '1977', redirect: '/personal/name', _csrf: csrfToken })
          expect(response.statusCode).toBe(302)
        })
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
    test('it returns a 200 response', async () => {
      const response = await request(app).get(amountResponse.url)
      expect(response.statusCode).toBe(200)
    })

    test('it returns a 422 response if no redirect is provided', async () => {
      request(app)
        .get(amountResponse.url)
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post('/login/questions/addresses')
            
            .send({_csrf: csrfToken})
          expect(response.statusCode).toBe(422)
        })
    })

    test('it returns a 422 response for no posted values', async () => {
      request(app)
        .get(amountResponse.url)
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post(amountResponse.url)
            
            .send({ redirect: '/start', _csrf: csrfToken })
          expect(response.statusCode).toBe(422)
        })
    })

    const badAmounts = ['dinosaur', '10.0', '10.000', '-10', '.1']
    badAmounts.map(badAmount => {
      test(`it returns a 422 for a bad posted amount: "${badAmount}"`, async () => {
        request(app)
          .get(amountResponse.url)
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post(amountResponse.url)
              
              .send({
                [`${amountResponse.key}Amount`]: badAmount,
                [`${amountResponse.key}PaymentMethod`]: 'cheque',
                redirect: '/start',
                _csrf: csrfToken
              })
            expect(response.statusCode).toBe(422)
          })
      })
    })

    test('it returns a 422 response for a good amount but NO payment method', async () => {
      request(app)
        .get(amountResponse.url)
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post(amountResponse.url)
            
            .send({
              [`${amountResponse.key}Amount`]: '10',
              redirect: '/start',
              _csrf: csrfToken
            })
          expect(response.statusCode).toBe(422)
        })
    })

    const goodAmounts = ['0', '10', '10.00', '.10', '', null]
    goodAmounts.map(goodAmount => {
      test(`it returns a 302 for a good posted amount: "${goodAmount}"`, async () => {
        request(app)
          .get(amountResponse.url)
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post(amountResponse.url)
              
              .send({
                [`${amountResponse.key}Amount`]: goodAmount,
                [`${amountResponse.key}PaymentMethod`]: 'cheque',
                redirect: '/start',
                _csrf: csrfToken
              })
            expect(response.statusCode).toBe(302)
            expect(response.headers.location).toEqual('/start')
          })
      })
    })

    test('it returns a 302 response for NO amount but a good payment method', async () => {
      request(app)
        .get(amountResponse.url)
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post(amountResponse.url)
            
            .send({
              [`${amountResponse.key}PaymentMethod`]: 'cheque',
              redirect: '/start',
              _csrf: csrfToken
            })
          expect(response.statusCode).toBe(302)
        })
    })

    test('it returns a 422 response for a good amount but a BAD payment method', async () => {
      request(app)
        .get(amountResponse.url)
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post(amountResponse.url)
            
            .send({
              [`${amountResponse.key}Amount`]: '10',
              [`${amountResponse.key}PaymentMethod`]: 'bitcoin',
              redirect: '/start',
              _csrf: csrfToken
            })
          expect(response.statusCode).toBe(422)
        })
    })

    const goodPaymentMethods = ['cheque', 'directDeposit']
    goodPaymentMethods.map(paymentMethod => {
      test(`it returns a 302 for a good posted payment method: "${paymentMethod}"`, async () => {
        request(app)
          .get(amountResponse.url)
          .expect(200)
          .end(async function(err, res) {
            var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
            const response = await request(app)
              .post(amountResponse.url)
              
              .send({
                [`${amountResponse.key}Amount`]: '10',
                [`${amountResponse.key}PaymentMethod`]: paymentMethod,
                redirect: '/start',
                _csrf: csrfToken
              })
            expect(response.statusCode).toBe(302)
            expect(response.headers.location).toEqual('/start')
          })
      })
    })
  })
})

describe('Test securityQuestion responses', () => {
  const securityQuestionPages = ['/login/securityQuestion', '/login/securityQuestion2']

  securityQuestionPages.map(securityQuestionPage => {
    test('it returns a 422 response when posting a bad value', async () => {
      request(app)
      .get(securityQuestionPage)
      .expect(200)
      .end(async function(err, res) {
        var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
        const response = await request(app)
          .post(securityQuestionPage)
          
          .send({ securityQuestion: '/login/question/who-let-the-dogs-out', _csrf: csrfToken })
        expect(response.statusCode).toBe(422)
      })
    })

    const securityQuestionUrls = ['/login/questions/child', '/login/questions/trillium']
    securityQuestionUrls.map(url => {
      test(`it returns a 302 response when posting a good value: ${url}`, async () => {
        request(app)
        .get(securityQuestionPage)
        .expect(200)
        .end(async function(err, res) {
          var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
          const response = await request(app)
            .post(securityQuestionPage)
            .send({ securityQuestion: url, _csrf: csrfToken })
          expect(response.statusCode).toBe(302)
          expect(response.headers.location).toEqual(url)
        })
      })
    })
  })
})

describe('Test /login/questions/addresses responses', () => {
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
      request(app)
      .get('/login/questions/addresses')
      .expect(200)
      .end(async function(err, res) {
        var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
        badRequest._csrf= csrfToken;
        const response = await request(app)
          .post('/login/questions/addresses')
          .send(badRequest.send)
        expect(response.statusCode).toBe(422)
      })
    })
  })

  test('it returns a 302 for a good request', async () => {
    request(app)
      .get('/login/questions/addresses')
      .expect(200)
      .end(async function(err, res) {
        var csrfToken = unescape(/XSRF-TOKEN=(.*?);/.exec(res.headers['set-cookie']));
        goodRequest._csrf= csrfToken;
        const response = await request(app)
          .post('/login/questions/addresses')
          
          .send(goodRequest)
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toEqual('/personal/name')
      })
    
  })
})
