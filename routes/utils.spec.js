const cheerio = require('cheerio')

const extractCsrfToken = res => {
  var $ = cheerio.load(res.text)
  return $('[name=_csrf]').val()
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

module.exports = { extractCsrfToken }
