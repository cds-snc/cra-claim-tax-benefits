const { SINFilter, hasData, getPreviousRoute, isoDateHintText, getNextRoute } = require('./index')
const API = require('./../api')

const testRoutes = [
  { name: 'start', path: '/start' },
  { name: 'login code', path: '/login/code' },
  { name: 'rrsp', path: '/deductions/rrsp' },
  { name: 'rrsp amount', path: '/deductions/rrsp/amount', editInfo: 'deductions.rrspClaim' },
  { name: 'medical', path: '/deductions/medical' },
]

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

  test('returns false for disabilityClaim', () => {
    expect(hasData(user, 'deductions.disabilityClaim')).toBe(false)
  })

  test('returns true for a false value that exists', () => {
    expect(hasData({ obj: { bool: false } }, 'obj.bool')).toBe(true)
  })

  test('returns the value (false) for a false value that exists with extra param', () => {
    expect(hasData({ obj: { bool: false } }, 'obj.bool', true)).toBe(false)
  })

  test('returns value for regular string with extra param ophthalmosaurus', () => {
    expect(hasData({ obj: { string: 'ophthalmosaurus' } }, 'obj.string', true)).toEqual(
      'ophthalmosaurus',
    )
  })
})

describe('Test getNextRoute function', () => {
  const user = API.getUser('A5G98S4K1')

  test('return false for a route that does not exist', () => {
    const obj = getNextRoute({path: '/deductions/medical', session: user}, testRoutes)
    expect(obj.path).toEqual(undefined)
  })

  test('finds next route path by name', () => {
    const obj = getNextRoute({path: '/login/code', session: user}, testRoutes)
    expect(obj.path).toEqual('/deductions/rrsp')
  })

  test('navigates to an edit page if necessary (yes to amount)', () => {
    const user = { deductions: { rrspClaim: true } }
    const obj = getNextRoute({path: '/deductions/rrsp', session: user}, testRoutes)
    expect(obj.path).toEqual('/deductions/rrsp/amount')
  })

  test('skips an edit page if no to amount/deduction', () => {
    const user = { deductions: { rrspClaim: null } }
    const obj = getNextRoute({path: '/deductions/rrsp', session: user}, testRoutes)
    expect(obj.path).toEqual('/deductions/medical')
  })
})

describe('Test getPreviousRoute function', () => {
  const user = API.getUser('A5G98S4K1')

  test('return false for a route that does not exist', () => {
    const obj = getPreviousRoute({path: '/start', session: user}, testRoutes)
    expect(obj.path).toEqual(undefined)
  })

  test('finds previous route path by name', () => {
    const obj = getPreviousRoute({path: '/login/code', session: user}, testRoutes)
    expect(obj.path).toEqual('/start')
  })

  test('navigates to an edit page if it was edited', () => {
    const user = { deductions: { rrspClaim: true } }
    const obj = getPreviousRoute({path: '/deductions/medical', session: user}, testRoutes)
    expect(obj.path).toEqual('/deductions/rrsp/amount')
  })

  test('skips an edit page if it was not edited', () => {
    const user = { deductions: { rrspClaim: null } }
    const obj = getPreviousRoute({path: '/deductions/medical', session: user}, testRoutes)
    expect(obj.path).toEqual('/deductions/rrsp')
  })
})

describe('Test isoDateHintText function', () => {
  test('an ISO date formatted "dd mm yyyy"', () => {
    expect(isoDateHintText('1961-04-12')).toBe('12 04 1961')
  })

  test('an non-ISO date string to throw an error', () => {
    expect(() => isoDateHintText('Cretaceous period')).toThrowError(/must be a valid ISO date/)
  })

  test('an ISO datetime string to throw an error', () => {
    expect(() => isoDateHintText('1961-04-12T12:34:56.000Z')).toThrowError(
      /must be formatted yyyy-mm-dd/,
    )
  })
})
