const { SINFilter, hasData } = require('./index')
const API = require('./../api')

describe('Test SINFilter', () => {
  const sinFilterUnchanged = ['1', '', '1234567890', '12345678']
  sinFilterUnchanged.map(value => {
    test(`returns value for "${value}"`, () => {
      expect(SINFilter(value)).toEqual(value)
    })
  })

  const sinFilterChanged = [['123456789', '123 456 789'], ['ABCDEFGHI', 'ABC DEF GHI']]
  sinFilterChanged.map(values => {
    test(`returns "${values[1]}" for "${values[0]}"`, () => {
      expect(SINFilter(values[0])).toEqual(values[1])
    })
  })
})

describe('Test hasData function', () => {
  const user = API.getUser('A5G98S4K1')

  test('returns true for maritalStatus', () => {
    expect(hasData(user, 'personal.maritalStatus')).toBe(true)
  })

  test('returns false for property that does not exist', () => {
    expect(hasData(user, 'personal.middleName')).toBe(false)
  })

  test('returns true for city in address', () => {
    expect(hasData(user, 'personal.address.city')).toBe(true)
  })

  test('returns false for non-object', () => {
    expect(hasData('this is not an object', 'personal.address.city')).toBe(false)
  })

  test('returns false for null object', () => {
    expect(hasData(null, 'personal.address.city')).toBe(false)
  })

  test('returns false for empty object', () => {
    expect(hasData({}, 'personal.address.city')).toBe(false)
  })

  test('returns false for empty string', () => {
    expect(hasData({ obj: { string: '' } }, 'obj.string')).toBe(false)
  })

  test('returns true for disabilityClaim', () => {
    expect(hasData(user, 'deductions.disabilityClaim')).toBe(false)
  })
})
