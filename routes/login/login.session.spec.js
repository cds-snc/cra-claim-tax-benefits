const session = require('supertest-session')
const { extractCsrfToken, withCSRF } = require('../utils.spec')
const cheerio = require('cheerio')
const app = require('../../app.js')

let csrfToken, cookie, testSession

const doAccessCode = (code = 'A5G98S4K1') => {
  return request => {
    request.use(withCSRF(cookie, csrfToken)).send({
      code,
      redirect: '/login/sin',
    })
  }
}

const doSIN = (sin = '540 739 869') => {
  return request => {
    request.use(withCSRF(cookie, csrfToken)).send({
      sin,
      redirect: '/login/dateOfBirth',
    })
  }
}

const doDateofBirth = ({ dobDay = '09', dobMonth = '09', dobYear = '1977' } = {}) => {
  return request => {
    request.use(withCSRF(cookie, csrfToken)).send({
      dobDay,
      dobMonth,
      dobYear,
      redirect: '/personal/name',
    })
  }
}

describe('Test /login SESSION responses', () => {
  beforeEach(async () => {
    testSession = session(app)
    const getresp = await testSession.get('/login/code')
    cookie = getresp.headers['set-cookie']
    csrfToken = extractCsrfToken(getresp)
  })

  // TEST DONT RETURN TO ACCESS CODE PAGE IF ONLY SIN (NO ACCESS CODE OR DOB)
  test('it returns a 200 on /login/dob page when only the SIN exists', async () => {
    const response = await testSession.post('/login/sin').use(doSIN()) // SIN is good
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login/dateOfBirth')

    const response2 = await testSession.get(response.headers.location)
    expect(response2.statusCode).toBe(200)
    const $ = cheerio.load(response2.text)
    expect($('h1').text()).toEqual('Enter your date of birth')
    expect($('.error-list__link').length).toBe(0)
  })

  // TEST RETURN TO ACCESS CODE PAGE IF ONLY DOB (NO ACCESS CODE OR SIN)
  test('it returns a 422 on /login/code page when only the DOB exists, but the SIN and code is missing', async () => {
    const response = await testSession.post('/login/dateOfBirth').use(doDateofBirth()) // dob is good
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login/code')

    const response2 = await testSession.get(response.headers.location)
    expect(response2.statusCode).toBe(422)
    const $ = cheerio.load(response2.text)
    const firstError = $('.error-list__link').first()
    expect(firstError.attr('href')).toEqual('#code')
    expect(firstError.text()).toMatch('Please enter an access code')
  })

  // TEST RETURN TO ACCESS CODE PAGE IF SIN AND DOB (NO ACCESS CODE)
  test('it returns a 422 on /login/code page when SIN and DOB exist, but the code is missing', async () => {
    const response = await testSession
      .post('/login/sin')
      .use(doSIN()) // SIN is good
      .then(() => {
        return testSession.post('/login/dateOfBirth').use(doDateofBirth()) // dob is good
      })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login/code')

    const response2 = await testSession.get(response.headers.location)
    expect(response2.statusCode).toBe(422)
    const $ = cheerio.load(response2.text)
    const firstError = $('.error-list__link').first()
    expect(firstError.attr('href')).toEqual('#code')
    expect(firstError.text()).toMatch('Please enter an access code')
  })

  // TEST REDIRECT TO ERROR PAGE IF DOB IS WRONG
  test('it returns a 200 on /login/error/doesNotMatch page when the DATE OF BIRTH does not match the access code', async () => {
    const response = await testSession
      .post('/login/code')
      .use(doAccessCode())
      .then(() => {
        return testSession.post('/login/sin').use(doSIN()) // SIN is good
      })
      .then(() => {
        return testSession.post('/login/dateOfBirth').use(doDateofBirth({ dobYear: '1999' })) // wrong year
      })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login/error/doesNotMatch')

    const response2 = await testSession.get(response.headers.location)
    expect(response2.statusCode).toBe(200)
  })

  // TEST REDIRECT TO ERROR PAGE IF SIN AND DOB ARE WRONG
  test('it returns a 422 on /login/code page when the SIN + DATE OF BIRTH does not match the access code', async () => {
    const response = await testSession
      .post('/login/code')
      .use(doAccessCode())
      .then(() => {
        return testSession.post('/login/sin').use(doSIN('117166934')) // wrong SIN
      })
      .then(() => {
        return testSession.post('/login/dateOfBirth').use(doDateofBirth({ dobYear: '1999' })) // wrong year
      })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login/code')

    const response2 = await testSession.get(response.headers.location)
    expect(response2.statusCode).toBe(422)
  })

  // TEST RETURN TO SIN PAGE IF THERE IS AN ACCESS CODE AND DOB BUT NO SIN
  test('it returns a 200 on /login/sin page when the SIN + DATE OF BIRTH does not match the access code', async () => {
    const response = await testSession
      .post('/login/code')
      .use(doAccessCode())
      // SIN IS MISSING
      .then(() => {
        return testSession.post('/login/dateOfBirth').use(doDateofBirth({ dobYear: '1999' })) // wrong year
      })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login/sin')

    const response2 = await testSession.get(response.headers.location)
    expect(response2.statusCode).toBe(422)
    const $ = cheerio.load(response2.text)
    const firstError = $('.error-list__link').first()
    expect(firstError.attr('href')).toEqual('#sin')
    expect(firstError.text()).toMatch('Please enter a SIN')
  })

  // TEST GOOD CODE, SIN AND DOB GO TO NAME PAGE
  test('it returns a 200 on the /personal/name page when code, SIN, and DoB are good', async () => {
    const response = await testSession
      .post('/login/code')
      .use(doAccessCode()) // code is good
      .then(() => {
        return testSession.post('/login/sin').use(doSIN()) // SIN is good
      })
      .then(() => {
        return testSession.post('/login/dateOfBirth').use(doDateofBirth()) // date of birth is good
      })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/personal/name')

    const response2 = await testSession.get(response.headers.location)
    expect(response2.statusCode).toBe(200)
    const $ = cheerio.load(response2.text)
    expect($('h1').text()).toEqual('Check your name is correct')
    expect($('.error-list__link').length).toBe(0)
  })

  test('it returns a 302 on the /personal/dateOfBirth page and redirects to the /login/code page with a valid sin/DoB combo that match a different access code', async () => {
    const response = await testSession
      .post('/login/code')
      .use(doAccessCode('A5G98S4K2'))
      .then(() => {
        return testSession
          .post('/login/sin')
          .use(doSIN())
      })
      .then(() => {
        return testSession.post('/login/dateOfBirth').use(doDateofBirth()) // date of birth is good
      })
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login/code')
  })
})
