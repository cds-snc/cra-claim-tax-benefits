const DB = require('./index')

const expectedRow = {
  code: 'A5G98S4K1',
  sin: '847339283',
  dateOfBirth: '1977-09-09',
  firstName: 'Gabrielle',
  locked: false,
}

describe('test DB', () => {
  describe('test validateCode', () => {
    test('returns expected row with correct code', () => {
      const row = DB.validateCode('A5G98S4K1')
      expect(row).not.toBe(null)
      expect(row).toEqual(expectedRow)
    })

    test('returns expected row with correct code lowercased', () => {
      const row = DB.validateCode('a5g98s4k1')
      expect(row).not.toBe(null)
      expect(row).toEqual(expectedRow)
    })

    test('returns null with a nonexistent access code', () => {
      const row = DB.validateCode('H3LLY34H!')
      expect(row).toBe(null)
    })
  })

  describe('test validateUser', () => {
    const login = {
      code: 'A5G98S4K1',
      sin: '847339283',
      dateOfBirth: '1977-09-09',
    }

    test('returns expected row with correct information', () => {
      const row = DB.validateUser({ ...login })
      expect(row).not.toBe(null)
      expect(row).toEqual(expectedRow)
    })

    test('returns expected row with correct information including lowercased access code', () => {
      const row = DB.validateUser({ ...login, ...{ code: 'a5g98s4k1' } })
      expect(row).not.toBe(null)
      expect(row).toEqual(expectedRow)
    })

    test('returns expected row with correct information including spaces and hyphens in SIN', () => {
      const row = DB.validateUser({ ...login, ...{ sin: '8-4-7 3-3-9 2-8-3' } })
      expect(row).not.toBe(null)
      expect(row).toEqual(expectedRow)
    })

    test('returns null without SIN', () => {
      const row = DB.validateUser({ ...login, ...{ sin: '' } })
      expect(row).toBe(null)
    })

    test('returns null without DoB', () => {
      const row = DB.validateUser({ ...login, ...{ dateOfBirth: '' } })
      expect(row).toBe(null)
    })

    test('returns null with wrong code', () => {
      const row = DB.validateUser({ ...login, ...{ code: 'B5G98S4K1' } }) // starts with 'A', not 'B'
      expect(row).toBe(null)
    })

    test('returns null with wrong SIN', () => {
      const row = DB.validateUser({ ...login, ...{ sin: '947339283' } }) // starts with '8', not '9'
      expect(row).toBe(null)
    })

    test('returns null with wrong DoB', () => {
      const row = DB.validateUser({ ...login, ...{ dateOfBirth: '1978-09-09' } }) // starts '1977', not '1978'
      expect(row).toBe(null)
    })
  })
})

/*

test('returns null with a nonexistent login.code', () => {
  const user = API.getUser('H3LLY34H')
  expect(user).toBe(null)
})

test('returns matching login code as an array', () => {
  const codes = API.getMatches()
  expect(codes).toBeInstanceOf(Array)
  expect(codes.length).toBe(2)
})

test('returns matching login codes as uppercase and lowercase', () => {
  const codes = API.getMatches()
  expect(codes[0]).toEqual('a5g98s4k1')
  expect(codes[1]).toEqual('A5G98S4K1')
})

*/
