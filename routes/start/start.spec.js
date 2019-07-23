const request = require('supertest')
const cheerio = require('cheerio')
const app = require('../../app.js')

describe('Test server responses', () => {
  test('it redirects to /start for the root path', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/start')
  })

  test('it returns a 200 response for the /start path', async () => {
    const response = await request(app).get('/start')
    expect(response.statusCode).toBe(200)
  })

  test('it redirects to /start?lang=fr for the /commencer path', async () => {
    const response = await request(app).get('/commencer')
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual('/start?lang=fr')
  })

  describe('it renders the h1 text for the /start path', () => {
    test('in English with a language header', async () => {
      const response = await request(app)
        .get('/start')
        .set('Accept-Language', 'en')

      const $ = cheerio.load(response.text)
      expect($('h1').text()).toEqual('Claim Tax Benefits')
      expect($('html').attr('lang')).toEqual('en')
    })

    test('in English with the "en" query param', async () => {
      const response = await request(app).get('/start?lang=en')

      const $ = cheerio.load(response.text)
      expect($('h1').text()).toEqual('Claim Tax Benefits')
      expect($('html').attr('lang')).toEqual('en')
    })

    test('in English with a bad query param', async () => {
      const response = await request(app).get('/start?lang=pt')

      const $ = cheerio.load(response.text)
      expect($('h1').text()).toEqual('Claim Tax Benefits')
      expect($('html').attr('lang')).toEqual('en')
    })

    test('in French with a language header', async () => {
      const response = await request(app)
        .get('/start')
        .set('Accept-Language', 'fr-CA, fr;q=0.9, en;q=0.8')

      const $ = cheerio.load(response.text)
      expect($('h1').text()).toEqual('Réclamer des avantages fiscaux')
      expect($('html').attr('lang')).toEqual('fr')
    })

    test('in French with an "fr" query param', async () => {
      const response = await request(app).get('/start?lang=fr')

      const $ = cheerio.load(response.text)
      expect($('h1').text()).toEqual('Réclamer des avantages fiscaux')
      expect($('html').attr('lang')).toEqual('fr')
    })
  })

  test('it returns security-focused headers in reponses', async () => {
    const response = await request(app).get('/start')

    /*
      More documentaion on each of these can be found here:
      - https://helmetjs.github.io/docs/
    */
    expect(response.headers['x-dns-prefetch-control']).toEqual('off')
    expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN')
    expect(response.headers['strict-transport-security']).toEqual(
      'max-age=15552000; includeSubDomains',
    )
    expect(response.headers['x-download-options']).toEqual('noopen')
    expect(response.headers['x-content-type-options']).toEqual('nosniff')
    expect(response.headers['x-xss-protection']).toEqual('1; mode=block')

    expect(response.headers['x-powered-by']).toBeUndefined()
  })
})
