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
      expect($('td div').text()).toEqual('Married')
    })

    test('it defaults to Married being checked for /personal/maritalStatus/edit path', async () => {
      const response = await request(app).get('/personal/maritalStatus/edit')
      const $ = cheerio.load(response.text)
      expect($('#maritalStatusMarried').attr('checked')).toEqual('checked')
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
        .send({ redirect: '/offramp', residence: 'Alberta' })
      expect(response.headers.location).toEqual('/offramp')
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
      streetName: 'Awesome Avenue',
      city: 'Awesawa',
      postalCode: 'H3L1Y4',
      province: 'Ontario',
      redirect: '/personal/address',
    }

    const badRequests = [
      {
        label: 'no streetName or city or postalCode or province',
        send: {
          ...goodRequest,
          ...{ streetName: '', city: '', postalCode: '', province: '' },
        },
      },
      {
        label: 'no streetName',
        send: {
          ...goodRequest,
          ...{ streetName: '' },
        },
      },
      {
        label: 'no city',
        send: {
          ...goodRequest,
          ...{ city: '' },
        },
      },
      {
        label: 'no postalCode',
        send: {
          ...goodRequest,
          ...{ postalCode: '' },
        },
      },
      {
        label: 'bad postalCode',
        send: {
          ...goodRequest,
          ...{ postalCode: '0h3 N03' },
        },
      },
      {
        label: 'no province',
        send: {
          ...goodRequest,
          ...{ province: '' },
        },
      },
      {
        label: 'bad province',
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
