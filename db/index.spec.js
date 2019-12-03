const DB = require('./index')

const expectedRow = {
  code: 'A5G98S4K1',
  sin: '540739869',
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

    test('returns a code not recognized error with a nonexistent access code', () => {
      const row = DB.validateCode('H3LLY34H!')
      expect(row).toBe(null)
    })
  })

  describe('test validateUser', () => {
    const login = {
      code: 'A5G98S4K1',
      sin: '540739869',
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
      const row = DB.validateUser({ ...login, ...{ sin: '5-4-0 7-3-9 8-6-9' } })
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

    test('returns an error with wrong code', () => {
      const row = DB.validateUser({ ...login, ...{ code: 'B5G98S4K1' } }) // starts with 'A', not 'B'
      expect(row.error).not.toBeUndefined()
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
