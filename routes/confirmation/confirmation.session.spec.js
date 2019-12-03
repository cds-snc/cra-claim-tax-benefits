const session = require('supertest-session')
const { extractCsrfToken, withCSRF } = require('../utils.spec')
const cheerio = require('cheerio')
const app = require('../../app.js')

let csrfToken, cookie, testSession

const doNotice = (noticeOfAssessment = 'Yes') => {
  return request => {
    request.use(withCSRF(cookie, csrfToken)).send({
      noticeOfAssessment,
      redirect: '/checkAnswers',
    })
  }
}

const doSecurityQuestion = securityQuestion => {
  return request => {
    request.use(withCSRF(cookie, csrfToken)).send({
      securityQuestion,
    })
  }
}

describe('Test confirmation SESSION responses', () => {
  beforeEach(async () => {
    testSession = session(app)
    const getresp = await testSession.get('/login/code')
    cookie = getresp.headers['set-cookie']
    csrfToken = extractCsrfToken(getresp)
  })

  // TEST NO FROM THE NOTICE PAGE, CHECK ANSWERS PAGE, NO BENEFITS CALCS, NO DOWNLOAD LINK ON CONFIRMATION PAGE
  test('it shows no benefit calcs, no download button for "No" on the notice page', async () => {
    const response = await testSession.post('/login/notice').use(doNotice('No'))
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/checkAnswers')

    // no benefits calculations
    const responseReview = await testSession.get('/review')
    expect(responseReview.statusCode).toBe(200)
    let $ = cheerio.load(responseReview.text)
    expect($('h1').text()).toEqual('Review and file tax return')
    expect(
      $('h2')
        .eq(1)
        .text(),
    ).toMatch('We will use your information to file your taxes.')

    // no download link
    const responseConfirmation = await testSession.get('/confirmation')
    expect(responseConfirmation.statusCode).toBe(200)
    $ = cheerio.load(responseConfirmation.text)
    expect($('h1').text()).toEqual('You have filed your 2018 taxes')
    expect($('a[role="button"]').length).toBe(0)
  })

  // TEST YES FROM NOTICE PAGE, SKIP SEC Qs, CHECK ANSWERS PAGE, NO BENEFITS CALCS, NO DOWNLOAD LINK ON CONFIRMATION PAGE
  test('it shows no benefit calcs, no download button for "Yes" on the notice page, but a skip on the /securityQuestion page', async () => {
    const response = await testSession.post('/login/notice').use(doNotice())
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login/securityQuestion')

    const response2 = await testSession
      .post('/login/securityQuestion')
      .use(doSecurityQuestion('/checkAnswers'))
    expect(response2.statusCode).toBe(302)
    expect(response2.headers.location).toBe('/checkAnswers')

    // no benefits calculations
    const responseReview = await testSession.get('/review')
    expect(responseReview.statusCode).toBe(200)
    let $ = cheerio.load(responseReview.text)
    expect($('h1').text()).toEqual('Review and file tax return')
    expect(
      $('h2')
        .eq(1)
        .text(),
    ).toMatch('We will use your information to file your taxes.')

    // no download link
    const responseConfirmation = await testSession.get('/confirmation')
    expect(responseConfirmation.statusCode).toBe(200)
    $ = cheerio.load(responseConfirmation.text)
    expect($('h1').text()).toEqual('You have filed your 2018 taxes')
    expect($('a[role="button"]').length).toBe(0)
  })

  // TEST YES FROM NOTICE PAGE, SEC Q, FINANCIAL PAGE, CHECK ANSWERS PAGE, YES BENEFITS CALCS, YES DOWNLOAD LINK ON CONFIRMATION PAGE
  test('it shows benefit calcs and download button for "Yes" on the notice page, and a question on on the /securityQuestion page', async () => {
    let goodDoBRequest = {
      dobDay: '09',
      dobMonth: '09',
      dobYear: '1977',
      redirect: '/personal/name',
    }

    const response = await testSession.post('/login/notice').use(doNotice())
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login/securityQuestion')

    const response2 = await testSession
      .post('/login/questions/child')
      .use(withCSRF(cookie, csrfToken))
      .send({ ...goodDoBRequest, ...{ childLastName: 'Laika' } })
    expect(response2.statusCode).toBe(302)

    const response3 = await testSession
      .post('/login/questions/dateOfResidence')
      .use(withCSRF(cookie, csrfToken))
      .send({ ...goodDoBRequest})
    expect(response3.statusCode).toBe(302)

    // YES benefits calculations
    const responseReview = await testSession.get('/review')
    expect(responseReview.statusCode).toBe(200)
    let $ = cheerio.load(responseReview.text)
    expect($('h1').text()).toEqual('Review and file tax return')
    expect(
      $('h2')
        .eq(1)
        .text(),
    ).toMatch('Your 2018 tax benefits')

    // YES download link
    const responseConfirmation = await testSession.get('/confirmation')
    expect(responseConfirmation.statusCode).toBe(200)
    $ = cheerio.load(responseConfirmation.text)
    expect($('h1').text()).toEqual('You have filed your 2018 taxes')
    expect($('a[role="button"]').text()).toMatch('Download your 2018 express notice of assessment')
  })
})
