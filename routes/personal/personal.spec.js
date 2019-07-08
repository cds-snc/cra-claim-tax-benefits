const request = require('supertest')
const cheerio = require('cheerio')
const app = require('../../app.js')
const API = require('../../api/index')

describe('Test /[personal] responses', () => {
  test('it returns a 200 response for the /personal/address path', async () => {
    const response = await request(app).get('/personal/address')
    expect(response.statusCode).toBe(200)
  })

  describe('Test /personal/[maritalStatus] responses', () => {
    test('it returns a 200 response for the /personal/maritalStatus path', async () => {
      const response = await request(app).get('/personal/maritalStatus')
      expect(response.statusCode).toBe(200)
    })

    test('it has Married selected by default', async () => {
      const response = await request(app).get('/personal/maritalStatus')
      const $ = cheerio.load(response.text)
      expect($('td div').text()).toEqual('Married')
    })

    test('it returns a 200 response for the /personal/maritalStatus/edit path', async () => {
      const response = await request(app).get('/personal/maritalStatus/edit')
      expect(response.statusCode).toBe(200)
    })

    test('it defaults to Married being checked for /personal/maritalStatus/edit path', async () => {
      const response = await request(app).get('/personal/maritalStatus/edit')
      const $ = cheerio.load(response.text)
      expect($('#maritalStatusMarried').attr('checked')).toEqual('checked')
    })

    test('it checks the stored marital status by default for /personal/maritalStatus/edit path', async () => {
      const user = API.getUser('QWER1234') 
      const response = await request(app).get('/personal/maritalStatus/edit', {data: user})
      const $ = cheerio.load(response.text)
      expect($('input[name=maritalStatus]:checked').val().toLowerCase).toEqual(user.personal.maritalStatus.toLowerCase)
    })

  })
})
