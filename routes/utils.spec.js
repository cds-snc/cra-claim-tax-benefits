const cheerio = require('cheerio')
const request = require('supertest')
const app = require('../app.js')

const extractCsrfToken = res => {
  var $ = cheerio.load(res.text)
  return $('[name=_csrf]').val()
}

const withCSRF = (_cookie, _csrf) => {
  return request => {
    request.set('Cookie', _cookie).send({ _csrf })
  }
}

describe('Test extractCsrfToken', () => {
  test('returns correct token', async () => {
    const htmlString = '<input type="hidden" name="_csrf" value="token"/>'
    const extractedToken = extractCsrfToken({ text: htmlString })

    expect(extractedToken).toEqual('token')
  })

  test('returns undefined when no _csrf field exists', async () => {
    const htmlString = '<input type="text" name="notCSRF" value="token"/>'
    const extractedToken = extractCsrfToken({ text: htmlString })

    expect(extractedToken).toBeUndefined()
  })

  test('returns empty string when _csrf field is empty', async () => {
    const htmlString = '<input type="hidden" name="_csrf" value=""/>'
    const extractedToken = extractCsrfToken({ text: htmlString })

    expect(extractedToken).toEqual('')
  })
})

describe('Test withCSRF', () => {
  test('sets cookie and sends data correctly', async () => {
    const response = await request(app)
      .get('/start')
      .use(withCSRF('TestCookie', 'TestToken'))

    expect(response.request.header).toMatchObject({ Cookie: 'TestCookie' })
    expect(response.request._data).toEqual({ _csrf: 'TestToken' })
  })
})

module.exports = { extractCsrfToken, withCSRF }
