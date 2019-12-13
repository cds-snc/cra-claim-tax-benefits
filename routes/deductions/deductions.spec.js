const request = require('supertest')
const app = require('../../app.js')
const { extractCsrfToken, withCSRF } = require('../utils.spec')

describe('Test /deductions responses', () => {
  const session = require('supertest-session')

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
        url: '/trillium/rent',
        key: 'trilliumRentClaim',
        yesRedir: '/trillium/rent/ontario',
      },
      {
        url: '/trillium/rent/ontario',
        key: 'trilliumRentOntario',
        yesRedir: '/trillium/rent/amount',
      },
      {
        url: '/trillium/propertyTax',
        key: 'trilliumPropertyTaxClaim',
        yesRedir: '/trillium/propertyTax/ontario',
      },
      {
        url: '/trillium/propertyTax/ontario',
        key: 'trilliumPropertyTaxOntario',
        yesRedir: '/trillium/propertyTax/amount',
      },
      {
        url: '/trillium/longTermCare',
        key: 'trilliumLongTermCareClaim',
        yesRedir: '/trillium/longTermCare/ontario',
      },
      {
        url: '/trillium/longTermCare/ontario',
        key: 'trilliumLongTermCareOntario',
        yesRedir: '/trillium/longTermCare/type',
      },
      {
        url: '/trillium/longTermCare/type',
        key: 'trilliumLongTermCareTypeClaim',
        yesRedir: '/trillium/longTermCare/cost',
      },
      {
        url: '/trillium/longTermCare/cost',
        key: 'trilliumLongTermCareCost',
        yesRedir: '/trillium/longTermCare/type/roomAndBoard',
        noRedir: '/trillium/longTermCare/type/amount',
      },
      {
        url: '/trillium/energy/reserve',
        key: 'trilliumEnergyReserveClaim',
        yesRedir: '/trillium/energy/reserve/ontario',
      },
      {
        url: '/trillium/energy/reserve/ontario',
        key: 'trilliumEnergyReserveOntario',
        yesRedir: '/trillium/energy/cost',
      },
      {
        url: '/trillium/energy/cost',
        key: 'trilliumEnergyCostClaim',
        yesRedir: '/trillium/energy/cost/amount',
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

        test('it redirects to the checkAnswers when posting "No" and having come from the checkAnswers page', async () => {
          const response = await request(app)
            .post(`${yesNoResponse.url}`)
            .query({ ref: 'checkAnswers' })
            .use(withCSRF(cookie, csrfToken))
            .send({ [yesNoResponse.key]: 'No', redirect: '/start' })
          expect(response.statusCode).toBe(302)
          expect(response.headers.location).toEqual('/checkAnswers')
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

  describe('Test /deductions/*/amount responses', () => {
    const amountReponses = [
      {
        url: '/trillium/rent/amount',
        key: 'trilliumRentAmount',
      },
      {
        url: '/trillium/propertyTax/amount',
        key: 'trilliumPropertyTaxAmount',
      },
      {
        url: '/trillium/energy/cost/amount',
        key: 'trilliumEnergyAmount',
      },
      {
        url: '/trillium/longTermCare/type/roomAndBoard',
        key: 'trilliumLongTermCareRoomAndBoardAmount',
      },
      {
        url: '/trillium/longTermCare/type/amount',
        key: 'trilliumLongTermCareAmount',
      },
    ]

    amountReponses.map(amountResponse => {
      describe(`Test ${amountResponse.url} responses`, () => {
        test('it returns a 200 response', async () => {
          const response = await request(app).get(amountResponse.url)
          expect(response.statusCode).toBe(200)
        })

        test('it returns a 500 response if no redirect is provided', async () => {
          const response = await request(app)
            .post(amountResponse.url)
            .use(withCSRF(cookie, csrfToken))
          expect(response.statusCode).toBe(500)
        })

        test('it returns a 302 response for no posted value', async () => {
          const response = await request(app)
            .post(amountResponse.url)
            .use(withCSRF(cookie, csrfToken))
            .send({ redirect: '/start' })
          expect(response.statusCode).toBe(302)
          expect(response.headers.location).toEqual('/start')
        })

        const badAmounts = ['dinosaur', '10.0', '10.000', '-10', '.1']
        badAmounts.map(badAmount => {
          test(`it returns a 422 for a bad posted value: "${badAmount}"`, async () => {
            const response = await request(app)
              .post(amountResponse.url)
              .use(withCSRF(cookie, csrfToken))
              .send({ [amountResponse.key]: badAmount, redirect: '/start' })
            expect(response.statusCode).toBe(422)
          })
        })

        const badFrAmounts = ['dinosaur', '10.0', '10.000', '-10', '.1', '10,000']
        badFrAmounts.map(badAmount => {
          test(`it returns a 422 for a bad posted french value: "${badAmount}"`, async () => {
            const response = await request(app)
              .post(amountResponse.url)
              .query({ lang: 'fr' })
              .use(withCSRF(cookie, csrfToken))
              .send({ [amountResponse.key]: badAmount, redirect: '/start' })
            expect(response.statusCode).toBe(422)
          })
        })

        const goodAmounts = ['0', '10', '10.00', '.10', '', null]
        goodAmounts.map(goodAmount => {
          test(`it returns a 302 for a good posted value: "${goodAmount}"`, async () => {
            const response = await request(app)
              .post(amountResponse.url)
              .use(withCSRF(cookie, csrfToken))
              .send({ [amountResponse.key]: goodAmount, redirect: '/start' })
            expect(response.statusCode).toBe(302)
            expect(response.headers.location).toEqual('/start')
          })
        })

        const goodFrAmounts = ['0', '10', '10,00', ',10', '10 000,23', '']
        goodFrAmounts.map(goodAmount => {
          test(`it returns a 302 for a good posted french value: "${goodAmount}"`, async () => {
            const response = await request(app)
              .post(amountResponse.url)
              .query({ lang: 'fr' })
              .use(withCSRF(cookie, csrfToken))
              .send({ [amountResponse.key]: goodAmount, redirect: '/start' })
            expect(response.statusCode).toBe(302)
            expect(response.headers.location).toEqual('/start')
          })
        })
      })
    })
  })
})
