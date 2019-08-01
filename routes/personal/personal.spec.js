const request = require('supertest')
const cheerio = require('cheerio')
const app = require('../../app.js')
const API = require('../../api/index')

describe('Test /personal responses', () => {
  describe('Test /personal 200 responses', () => {
    const urls = [
      '/personal/name',
      '/personal/maritalStatus',
      '/personal/maritalStatus/edit',
      '/personal/residence',
      '/personal/address',
      '/personal/address/edit',
    ]

    urls.map(url => {
      test(`it returns a 200 response for the path: "${url}" path`, async () => {
        const response = await request(app).get(url)
        expect(response.statusCode).toBe(200)
      })
    })
  })

  describe('Test /personal/maritalStatus responses', () => {
    test('it has Married selected by default', async () => {
      const response = await request(app).get('/personal/maritalStatus')
      const $ = cheerio.load(response.text)
      expect($('td div').text()).toEqual('Single')
    })

    test('it checks the stored marital status by default for /personal/maritalStatus/edit path', async () => {
      const user = API.getUser('A5G98S4K1')
      const response = await request(app).get('/personal/maritalStatus/edit', { data: user })
      const $ = cheerio.load(response.text)
      expect($('input[name=maritalStatus]:checked').val().toLowerCase).toEqual(
        user.personal.maritalStatus.toLowerCase,
      )
    })

    test('it returns a 422 with no marital status', async () => {
      const response = await request(app)
        .post('/personal/maritalStatus/edit')
        .send({ redirect: '/personal/maritalStatus' })
      expect(response.statusCode).toBe(422)
    })

    test('it returns a 422 with fake marital status', async () => {
      const response = await request(app)
        .post('/personal/maritalStatus/edit')
        .send({ maritalStatus: 'cat lady', redirect: '/personal/maritalStatus' })
      expect(response.statusCode).toBe(422)
    })

    test('it returns a 302 with valid marital status', async () => {
      const response = await request(app)
        .post('/personal/maritalStatus/edit')
        .send({ redirect: '/personal/maritalStatus', maritalStatus: 'Widowed' })
      expect(response.statusCode).toBe(302)
    })
  })

  describe('Test /personal/residence responses', () => {
    test('it returns a 422 with no option selected', async () => {
      const response = await request(app)
        .post('/personal/residence')
        .send({ redirect: '/personal/address' })
      expect(response.statusCode).toBe(422)
    })

    test('it returns a 302 when selecting unsupported province', async () => {
      const response = await request(app)
        .post('/personal/residence')
        .send({ redirect: '/offramp/residence', residence: 'Alberta' })
      expect(response.headers.location).toEqual('/offramp/residence')
      expect(response.statusCode).toBe(302)
    })

    test('it returns a 302 when selecting Ontario', async () => {
      const response = await request(app)
        .post('/personal/residence')
        .send({ redirect: '/personal/address', residence: 'Ontario' })
      expect(response.headers.location).toEqual('/personal/address')
      expect(response.statusCode).toBe(302)
    })
  })

  describe('Test /personal/address responses', () => {
    let goodRequest = {
      line1: 'Awesome Avenue',
      city: 'Awesawa',
      postalCode: 'H3L1Y4',
      province: 'Ontario',
      redirect: '/personal/address',
    }

    const badRequests = [
      {
        label: 'no streetAddress or city or postalCode or province',
        firstErrorId: '#line1',
        send: {
          ...goodRequest,
          ...{ line1: '', city: '', postalCode: '', province: '' },
        },
      },
      {
        label: 'no streetAddress',
        firstErrorId: '#line1',
        send: {
          ...goodRequest,
          ...{ line1: '' },
        },
      },
      {
        label: 'no city',
        firstErrorId: '#city',
        send: {
          ...goodRequest,
          ...{ city: '' },
        },
      },
      {
        label: 'no postalCode',
        firstErrorId: '#postalCode',
        send: {
          ...goodRequest,
          ...{ postalCode: '' },
        },
      },
      {
        label: 'bad postalCode',
        firstErrorId: '#postalCode',
        send: {
          ...goodRequest,
          ...{ postalCode: '0h3 N03' },
        },
      },
      {
        label: 'no province',
        firstErrorId: '#province',
        send: {
          ...goodRequest,
          ...{ province: '' },
        },
      },
      {
        label: 'bad province',
        firstErrorId: '#province',
        send: {
          ...goodRequest,
          ...{ province: 'Aurora' },
        },
      },
    ]


    badRequests.map(badRequest => {
      test(`it returns a 422 with: "${badRequest.label}"`, async () => {
        const response = await request(app)
          .post('/personal/address/edit')
          .send(badRequest.send)
        const $ = cheerio.load(response.text)
        expect($(badRequest.firstErrorId).attr('autofocus')).toEqual('autofocus')
        expect(response.statusCode).toBe(422)
      })
    })

    test('it returns a 302 with valid address', async () => {
      const response = await request(app)
        .post('/personal/address/edit')
        .send(goodRequest)
      expect(response.statusCode).toBe(302)
    })
  })
})
