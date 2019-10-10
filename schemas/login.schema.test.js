const { lastDayInMonth, toISOFormat } = require('./index')

describe('Test toISOFormat', () => {
  const _date = { dobYear: '1957', dobMonth: '12', dobDay: '05' }

  test('converts standard date to ISO date', () => {
    let date = _date
    expect(toISOFormat(date)).toEqual('1957-12-05')
  })

  test('converts date with one digit month to ISO date', () => {
    let date = { ..._date, ...{ dobMonth: '1' } }
    expect(toISOFormat(date)).toEqual('1957-01-05')
  })

  test('converts date with one digit day to ISO date', () => {
    let date = { ..._date, ...{ dobDay: '1' } }
    expect(toISOFormat(date)).toEqual('1957-12-01')
  })

  test('converts date with one digit day and one digit month to ISO date', () => {
    let date = { ..._date, ...{ dobMonth: '2', dobDay: '1' } }
    expect(toISOFormat(date)).toEqual('1957-02-01')
  })
})
