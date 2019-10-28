const { _toISOFormat, _getSinErrorMessage } = require('./index')

describe('Test _toISOFormat', () => {
  const _date = { dobYear: '1957', dobMonth: '12', dobDay: '05' }

  test('converts standard date to ISO date', () => {
    let date = _date
    expect(_toISOFormat(date)).toEqual('1957-12-05')
  })

  test('converts date with one digit month to ISO date', () => {
    let date = { ..._date, ...{ dobMonth: '1' } }
    expect(_toISOFormat(date)).toEqual('1957-01-05')
  })

  test('converts date with one digit day to ISO date', () => {
    let date = { ..._date, ...{ dobDay: '1' } }
    expect(_toISOFormat(date)).toEqual('1957-12-01')
  })

  test('converts date with one digit day and one digit month to ISO date', () => {
    let date = { ..._date, ...{ dobMonth: '2', dobDay: '1' } }
    expect(_toISOFormat(date)).toEqual('1957-02-01')
  })
})

describe('Test _getSinErrorMessage', () => {
  test('returns error message for no SIN', () => {
    expect(_getSinErrorMessage()).toEqual('errors.login.lengthSIN')
  })

  test('returns error message for empty string', () => {
    expect(_getSinErrorMessage('')).toEqual('errors.login.lengthSIN')
  })

  test('returns error message for non-numeric SIN', () => {
    expect(_getSinErrorMessage('123 456 AAA')).toEqual('errors.login.numericSIN')
  })

  const badLengthSins = ['1', '123 456 789 0', '123-456-78']
  badLengthSins.map(badLengthSin => {
    test(`returns error message for a SIN that’s more than 9 chars: ${badLengthSin}`, () => {
      expect(_getSinErrorMessage(badLengthSin)).toEqual('errors.login.lengthSIN')
    })
  })

  test('returns error message for a SIN that doesn’t match the expected SIN', () => {
    expect(_getSinErrorMessage('123 456 789', '111 111 111')).toEqual('errors.login.matchingSIN')
  })

  const matchingSins = ['123456789', '123 456 789', '123-456-789', '  1-2-3 4 5 6 7_8_9  ']
  matchingSins.map(matchingSin => {
    test(`returns no error message for a matching SIN: ${matchingSin}`, () => {
      expect(_getSinErrorMessage(matchingSin, '123456789')).toBe(false)
    })
  })
})
