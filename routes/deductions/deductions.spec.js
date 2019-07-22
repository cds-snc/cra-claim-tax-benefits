const request = require('supertest')
const app = require('../../app.js')

describe('Test /deductions responses', () => {
  describe('Test /deductions/rrsp responses', () => {
    test('it redirects to the edit page when posting "Yes"', async () => {
      const response = await request(app)
        .post('/deductions/rrsp')
        .send({ rrspClaim: 'Yes', redirect: '/' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/deductions/rrsp/amount')
    })

    test('it redirects to the posted redirect url when posting "No"', async () => {
      const response = await request(app)
        .post('/deductions/rrsp')
        .send({ rrspClaim: 'No', redirect: '/' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/')
    })
  })

  //Start of Charitable donation section
  describe('Test /deductions/donations responses', () => {
    test('it redirects to the edit page when posting "Yes"', async () => {
      const response = await request(app)
        .post('/deductions/donations')
        .send({ donationsClaim: 'Yes', redirect: '/' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/deductions/donations/amount')
    })

    test('it redirects to the posted redirect url when posting "No"', async () => {
      const response = await request(app)
        .post('/deductions/donations')
        .send({ donationsClaim: 'No', redirect: '/' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/')
    })
  })

  // Start of the trillium student residence section
  describe('Test /trillium/studentResidence responses', () => {
    test('it redirects to the posted redirect url when posting "Yes"', async () => {
      const response = await request(app)
        .post('/trillium/studentResidence')
        .send({ trilliumStudentResidence: 'Yes', redirect: '/' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/')
    })

    test('it redirects to the posted redirect url when posting "No"', async () => {
      const response = await request(app)
        .post('/trillium/studentResidence')
        .send({ trilliumStudentResidence: 'No', redirect: '/' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/')
    })
  })

  describe('Test /deductions/* yesNo responses', () => {
    const yesNoResponses = [
      {
        url: '/deductions/rrsp',
        key: 'rrspClaim',
      },
      {
        url: '/deductions/donations',
        key: 'donationsClaim',
      },
      {
        url: '/trillium/studentResidence',
        key: 'trilliumStudentResidence',
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
            .send({ redirect: '/' })
          expect(response.statusCode).toBe(422)
        })

        const badValues = ['', null, false, 0, 'dinosaur', 'yes']
        badValues.map(badValue => {
          test(`it returns a 422 for a bad posted value: "${badValue}"`, async () => {
            const response = await request(app)
              .post(yesNoResponse.url)
              .send({ [yesNoResponse.key]: badValue, redirect: '/' })
            expect(response.statusCode).toBe(422)
          })
        })
      })
    })
  })

  describe('Test /deductions/*/amount responses', () => {
    const amountReponses = [
      {
        url: '/deductions/rrsp/amount',
        key: 'rrspAmount',
      },
      {
        url: '/deductions/donations/amount',
        key: 'donationsAmount',
      },
      {
        url: '/trillium/rent/amount',
        key: 'trilliumRentAmount',
      },
      {
        url: '/trillium/propertyTax/amount',
        key: 'trilliumPropertyTaxAmount',
      },
      {
        url: '/trillium/energy/amount',
        key: 'trilliumEnergyAmount',
      },
      {
        url: '/trillium/longTermCare/amount',
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
          const response = await request(app).post(amountResponse.url)
          expect(response.statusCode).toBe(500)
        })

        test('it returns a 422 response for no posted value', async () => {
          const response = await request(app)
            .post(amountResponse.url)
            .send({ redirect: '/' })
          expect(response.statusCode).toBe(422)
        })

        const badAmounts = ['', null, 'dinosaur', '10.0', '10.000', '-10', '.1']
        badAmounts.map(badAmount => {
          test(`it returns a 422 for a bad posted value: "${badAmount}"`, async () => {
            const response = await request(app)
              .post(amountResponse.url)
              .send({ [amountResponse.key]: badAmount, redirect: '/' })
            expect(response.statusCode).toBe(422)
          })
        })

        const goodAmounts = ['0', '10', '10.00', '.10']
        goodAmounts.map(goodAmount => {
          test(`it returns a 302 for a good posted value: "${goodAmount}"`, async () => {
            const response = await request(app)
              .post(amountResponse.url)
              .send({ [amountResponse.key]: goodAmount, redirect: '/' })
            expect(response.statusCode).toBe(302)
            expect(response.headers.location).toEqual('/')
          })
        })
      })
    })
  })
})
