const request = require('supertest')
const app = require('../../app.js')

describe('Test /deductions responses', () => {
  //Start of RRSP section
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

  //Start of Medical Claim section
  describe('Test /deductions/medical responses', () => {
    test('it redirects to the edit page when posting "Yes"', async () => {
      const response = await request(app)
        .post('/deductions/medical')
        .send({ medicalClaim: 'Yes', redirect: '/' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/deductions/medical/amount')
    })

    test('it redirects to the posted redirect url when posting "No"', async () => {
      const response = await request(app)
        .post('/deductions/medical')
        .send({ medicalClaim: 'No', redirect: '/' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/')
    })
  })
  //End of Medical Claim section  

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

  //Start of political donations
  describe('Test /deductions/political responses', () => {
    test('it returns a 200 response for /deductions/political', async () => {
      const response = await request(app).get('/deductions/political')
      expect(response.statusCode).toBe(200)
    })

    test('it returns a 422 response for no posted value', async () => {
      const response = await request(app)
        .post('/deductions/political')
        .send({ redirect: '/' })
      expect(response.statusCode).toBe(422)
    })

    //Bad Federal amounts, good provincial amounts
    const badFederalPoliticalAmounts = ['dinosaur', '10.0', '10.000', '-10', '.1']
    badFederalPoliticalAmounts.map(politicalFederalAmount => {
      test(`it returns a 422 for a bad federal and good provincial posted value: "${politicalFederalAmount}"`, async () => {
        const politicalProvincialAmount = 10
        const response = await request(app)
          .post('/deductions/political/amount')
          .send({
            politicalFederalAmount,
            politicalProvincialAmount,
            redirect: '/',
          })
        expect(response.statusCode).toBe(422)
      })
    })

    //Bad provincial amounts, good federal amounts
    const badPoliticalProvincialAmount = ['dinosaur', '10.0', '10.000', '-10', '.1']
    badPoliticalProvincialAmount.map(politicalProvincialAmount => {
      test(`it returns a 422 for a bad provincial and good federal posted value: "${politicalProvincialAmount}"`, async () => {
        const politicalFederalAmount = 10
        const response = await request(app)
          .post('/deductions/political/amount')
          .send({
            politicalFederalAmount,
            politicalProvincialAmount,
            redirect: '/',
          })
        expect(response.statusCode).toBe(422)
      })
    })

    //Bad provincial amounts, bad federal amounts
    const badPoliticalAmount = ['dinosaur', '10.0', '10.000', '-10', '.1']
    badPoliticalAmount.map(politicalAmount => {
      test(`it returns a 422 for a bad provincial and bad federal posted value: "${politicalAmount}"`, async () => {
        const response = await request(app)
          .post('/deductions/political/amount')
          .send({
            politicalFederalAmount: politicalAmount,
            politicalProvincialAmount: politicalAmount,
            redirect: '/',
          })
        expect(response.statusCode).toBe(422)
      })
    })

    //Good provincial amounts, good federal amounts
    const goodPoliticalAmounts = ['', null, '0', '10', '10.00', '.10'] //For this page empty is a valid value to pass
    goodPoliticalAmounts.map(politicalAmount => {
      test(`it returns a 302 for both good posted value: "${politicalAmount}"`, async () => {
        const response = await request(app)
          .post('/deductions/political/amount')
          .send({
            politicalFederalAmount: politicalAmount,
            politicalProvincialAmount: politicalAmount,
            redirect: '/',
          })
        expect(response.statusCode).toBe(302)
      })
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

  // Start of the Climate Action Incentive section
  describe('Test /deductions/climate-action-incentive responses', () => {
    test('it redirects to the posted redirect url when posting "Yes"', async () => {
      const response = await request(app)
        .post('/deductions/climate-action-incentive')
        .send({ climateActionIncentiveIsRural: 'Yes', redirect: '/' })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual('/')
    })

    test('it redirects to the posted redirect url when posting "No"', async () => {
      const response = await request(app)
        .post('/deductions/climate-action-incentive')
        .send({ climateActionIncentiveIsRural: 'No', redirect: '/' })
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
        url: '/deductions/medical',
        key: 'medicalClaim',
      },
      {
        url: '/deductions/donations',
        key: 'donationsClaim',
      },
      {
        url: '/trillium/studentResidence',
        key: 'trilliumStudentResidence',
      },
      {
        url: '/deductions/political',
        key: 'politicalClaim',
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
        url: '/deductions/medical/amount',
        key: 'medicalAmount',
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
