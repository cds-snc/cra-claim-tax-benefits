const {
  SINFilter,
  hasData,
  getPreviousRoute,
  isoDateHintText,
  getRouteWithIndexByPath,
  currencyFilter,
  postAmount,
} = require('./index')
const API = require('./../api')

const testRoutes = [
  { path: '/start' },
  { path: '/login/code' },
  { path: '/login/questions', options: ['/login/questions/child', '/login/questions/trillium'] },
  { path: '/deductions/rrsp' },
  { path: '/deductions/rrsp/amount', editInfo: 'deductions.rrspClaim' },
  { path: '/deductions/medical' },
  { path: '/trillium/rent', editInfo: 'skip' },
  { path: '/trillium/rent/amount', editInfo: 'skip' },
  { path: '/trillium/propertyTax' },
  { path: '/checkAnswers' },
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

describe('Test currencyFilter', () => {
  const currencies = [
    {
      number: 240.34,
      locale: 'en',
      expectedResult: '$240.34',
    },
    {
      number: 25086.34,
      locale: 'en',
      expectedResult: '$25,086.34',
    },
    {
      number: 240.34,
      locale: 'fr',
      expectedResult: '240,34$',
    },
    {
      number: 25086.34,
      locale: 'fr',
      expectedResult: '25 086,34$',
    },
    {
      number: .34,
      locale: 'fr',
      expectedResult: '0,34$',
    },
  ]

  currencies.map((currency) => {
    test(`it returns a ${currency.locale} currency format of ${currency.expectedResult}`, () => {
      expect(currencyFilter(currency.number, currency.locale)).toBe(currency.expectedResult)
    })
  })
})

describe('Test postAmount function', () => {

  const amounts = [
    {
      input: '10 341,28',
      locale: 'fr',
      expectedResult: '10341.28',
    },
    {
      input: '1,025',
      locale: 'en',
      expectedResult: '1025',
    },
    {
      input: '2035.67',
      locale: 'en',
      expectedResult: '2035.67',
    },
  ]

  amounts.map( amount => {
    test(`expect postAmount to return ${amount.expectedResult}`, () => {
      expect(postAmount(amount.input, amount.locale)).toBe(amount.expectedResult)
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

describe('Test getRouteWithIndexByPath', () => {
  test('Returns null for a non-existent path', () => {
    const route = getRouteWithIndexByPath('/lets-get-that-money', testRoutes)
    expect(route).toBe(null)
  })

  test('Returns the first path with index of existing route', () => {
    const route = getRouteWithIndexByPath('/start', testRoutes)
    expect(route).toEqual({ index: 0, route: { path: '/start' } })
  })

  test('Returns the last path with index of existing route', () => {
    const route = getRouteWithIndexByPath('/checkAnswers', testRoutes)
    expect(route).toEqual({ index: 9, route: { path: '/checkAnswers' } })
  })

  test('Returns a route with an options key by looking for the path', () => {
    const route = getRouteWithIndexByPath('/login/questions', testRoutes)
    expect(route).toEqual({
      index: 2,
      route: {
        path: '/login/questions',
        options: ['/login/questions/child', '/login/questions/trillium'],
      },
    })
  })

  const optsUrls = ['/login/questions/child', '/login/questions/trillium']
  optsUrls.map(url => {
    test(`Returns a route with an options key by looking for a path in the options array: ${url}`, () => {
      const route = getRouteWithIndexByPath(url, testRoutes)
      expect(route).toEqual({
        index: 2,
        route: {
          path: '/login/questions',
          options: ['/login/questions/child', '/login/questions/trillium'],
        },
      })
    })
  })
})

describe('Test getPreviousRoute function', () => {
  const user = API.getUser('A5G98S4K1')

  test('return false for a route that does not exist', () => {
    const obj = getPreviousRoute({ path: '/start', session: user }, testRoutes)
    expect(obj.path).toEqual(undefined)
  })

  test('finds previous route path by name', () => {
    const obj = getPreviousRoute({ path: '/login/code', session: user }, testRoutes)
    expect(obj.path).toEqual('/start')
  })

  test('navigates to an edit page if it was edited', () => {
    const user = { deductions: { rrspClaim: true } }
    const obj = getPreviousRoute({ path: '/deductions/medical', session: user }, testRoutes)
    expect(obj.path).toEqual('/deductions/rrsp/amount')
  })

  test('skips an edit page if it was not edited', () => {
    const user = { deductions: { rrspClaim: null } }
    const obj = getPreviousRoute({ path: '/deductions/medical', session: user }, testRoutes)
    expect(obj.path).toEqual('/deductions/rrsp')
  })

  test('skip multiple pages if they are to be skipped', () => {
    const obj = getPreviousRoute({ path: '/trillium/propertyTax', session: user }, testRoutes)
    expect(obj.path).toEqual('/deductions/medical')
  })

  test('it returns checkAnswers route if ref is present', () => {
    const obj = getPreviousRoute(
      { path: '/deductions/medical', query: { ref: 'checkAnswers' }, session: user },
      testRoutes,
    )
    expect(obj.path).toEqual('/checkAnswers')
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
