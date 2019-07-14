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
})
