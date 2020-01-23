const DB = require('./index')

const expectedRow = {
  code:
    'd75535de98ecea315854491c8d036f8f$ada904924ee513b2d85d4ef775bbd1d835979dd8341047714da8d000ccec8adc',
  sin:
    '3c983be4174c2711a44953311ee69792$cd18d36c21efd729f3ee8aab191912fb9467dbaba0552652cc6c451ac8a5031a',
  dateOfBirth: '1977-09-09',
  firstName: 'Gabrielle',
  locked: false,
}

describe('test DB', () => {
  describe('test validateCode', () => {
    test('returns expected row with correct code', async () => {
      const row = await DB.validateCode('A5G98S4K1')
      expect(row).not.toBe(null)
      expect(row).toEqual(expectedRow)
    })

    test('returns expected row with correct code lowercased', async () => {
      const row = await DB.validateCode('a5g98s4k1')
      expect(row).not.toBe(null)
      expect(row).toEqual(expectedRow)
    })

    test('returns a code not recognized error with a nonexistent access code', async () => {
      const row = await DB.validateCode('H3LLY34H!')
      expect(row).toBe(null)
    })
  })

  describe('test validateUser', () => {
    const login = {
      code: 'A5G98S4K1',
      sin: '540739869',
      dateOfBirth: '1977-09-09',
    }

    test('returns expected row with correct information', async () => {
      const row = await DB.validateUser({ ...login })
      expect(row).not.toBe(null)
      expect(row).toEqual(expectedRow)
    })

    test('returns expected row with correct information including lowercased access code', async () => {
      const row = await DB.validateUser({ ...login, ...{ code: 'a5g98s4k1' } })
      expect(row).not.toBe(null)
      expect(row).toEqual(expectedRow)
    })

    test('returns expected row with correct information including spaces and hyphens in SIN', async () => {
      const row = await DB.validateUser({ ...login, ...{ sin: '5-4-0 7-3-9 8-6-9' } })
      expect(row).not.toBe(null)
      expect(row).toEqual(expectedRow)
    })

    test('returns null without DoB', async () => {
      const row = await DB.validateUser({ ...login, ...{ dateOfBirth: '' } })
      expect(row).toBe(null)
    })

    test('returns an error with wrong code', async () => {
      const row = await DB.validateUser({ ...login, ...{ code: 'B5G98S4K1' } }) // starts with 'A', not 'B'
      expect(row.error).not.toBeUndefined()
    })

    test('returns null with wrong DoB', async () => {
      const row = await DB.validateUser({ ...login, ...{ dateOfBirth: '1978-09-09' } }) // starts '1977', not '1978'
      expect(row).toBe(null)
    })
  })
})
