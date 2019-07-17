const request = require('supertest')
const app = require('../../app.js')

describe('Test /deductions responses', () => {
  describe('Test /deductions/rrsp responses', () => {
    test('it returns a 200 response for /deductions/rrsp', async () => {
      const response = await request(app).get('/deductions/rrsp')
      expect(response.statusCode).toBe(200)
    })

    test('it returns a 422 response for no posted value', async () => {
      const response = await request(app)
        .post('/deductions/rrsp')
        .send({ redirect: '/' })
      expect(response.statusCode).toBe(422)
    })

    const badRRSPClaims = ['', null, false, 0, 'dinosaur', 'yes']
    badRRSPClaims.map(rrspClaim => {
      test(`it returns a 422 for a bad posted value: "${rrspClaim}"`, async () => {
        const response = await request(app)
          .post('/deductions/rrsp')
          .send({ rrspClaim, redirect: '/' })
        expect(response.statusCode).toBe(422)
      })
    })

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

  describe('Test /deductions/rrsp/amount responses', () => {
    test('it returns a 200 response for /deductions/rrsp/amount', async () => {
      const response = await request(app).get('/deductions/rrsp')
      expect(response.statusCode).toBe(200)
    })

    test('it returns a 500 response if no redirect is provided', async () => {
      const response = await request(app).post('/deductions/rrsp/amount')
      expect(response.statusCode).toBe(500)
    })

    test('it returns a 422 response for no posted value', async () => {
      const response = await request(app)
        .post('/deductions/rrsp/amount')
        .send({ redirect: '/' })
      expect(response.statusCode).toBe(422)
    })

    const badRRSPAmounts = ['', null, 'dinosaur', '10.0', '10.000', '-10', '.1']
    badRRSPAmounts.map(rrspAmount => {
      test(`it returns a 422 for a bad posted value: "${rrspAmount}"`, async () => {
        const response = await request(app)
          .post('/deductions/rrsp/amount')
          .send({ rrspAmount, redirect: '/' })
        expect(response.statusCode).toBe(422)
      })
    })

    const goodRRSPAmounts = ['0', '10', '10.00', '.10']
    goodRRSPAmounts.map(rrspAmount => {
      test(`it returns a 302 for a good posted value: "${rrspAmount}"`, async () => {
        const response = await request(app)
          .post('/deductions/rrsp/amount')
          .send({ rrspAmount, redirect: '/' })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toEqual('/')
      })
    })
  })

  //Start of Charitable donation section
  describe('Test /deductions/donations responses', () => {
    test('it returns a 200 response for /deductions/donations', async () => {
      const response = await request(app).get('/deductions/donations')
      expect(response.statusCode).toBe(200)
    })

    test('it returns a 422 response for no posted value', async () => {
      const response = await request(app)
        .post('/deductions/donations')
        .send({ redirect: '/' })
      expect(response.statusCode).toBe(422)
    })

    const badDonationsClaims = ['', null, false, 0, 'dinosaur', 'yes']
    badDonationsClaims.map(donationsClaim => {
      test(`it returns a 422 for a bad posted value: "${donationsClaim}"`, async () => {
        const response = await request(app)
          .post('/deductions/donations')
          .send({ donationsClaim, redirect: '/' })
        expect(response.statusCode).toBe(422)
      })
    })

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

  describe('Test /deductions/donations/amount responses', () => {
    test('it returns a 200 response for /deductions/donations/amount', async () => {
      const response = await request(app).get('/deductions/donations')
      expect(response.statusCode).toBe(200)
    })

    test('it returns a 500 response if no redirect is provided', async () => {
      const response = await request(app).post('/deductions/donations/amount')
      expect(response.statusCode).toBe(500)
    })

    test('it returns a 422 response for no posted value', async () => {
      const response = await request(app)
        .post('/deductions/donations/amount')
        .send({ redirect: '/' })
      expect(response.statusCode).toBe(422)
    })

    const badDonationsAmounts = ['', null, 'dinosaur', '10.0', '10.000', '-10', '.1']
    badDonationsAmounts.map(donationsAmount => {
      test(`it returns a 422 for a bad posted value: "${donationsAmount}"`, async () => {
        const response = await request(app)
          .post('/deductions/donations/amount')
          .send({ donationsAmount, redirect: '/' })
        expect(response.statusCode).toBe(422)
      })
    })

    const goodDonationsAmounts = ['0', '10', '10.00', '.10']
    goodDonationsAmounts.map(donationsAmount => {
      test(`it returns a 302 for a good posted value: "${donationsAmount}"`, async () => {
        const response = await request(app)
          .post('/deductions/donations/amount')
          .send({ donationsAmount, redirect: '/' })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toEqual('/')
      })
    })
  })

})
