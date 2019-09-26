const { lastDayInMonth, toISOFormat } = require('./index')

describe('Test lastDayInMonth', () => {
  const monthLengths = [
    ['january', 31],
    ['february', 28],
    ['march', 31],
    ['april', 30],
    ['may', 31],
    ['june', 30],
    ['july', 31],
    ['august', 31],
    ['september', 30],
    ['october', 31],
    ['november', 30],
    ['december', 31],
  ]

  monthLengths.map((v, index) => {
    test(`returns ${v[1]} days for ${v[0]}`, () => {
      expect(lastDayInMonth('2019', index)).toEqual(v[1])
    })
  })

  describe('knows about leap years', () => {
    const february = 1
    const daysInFeb = [['2020', 29], ['2019', 28], ['2018', 28], ['2017', 28], ['2016', 29]]

    daysInFeb.map(v => {
      test(`returns ${v[1]} days in February in ${v[0]}`, () => {
        expect(lastDayInMonth(v[0], february)).toEqual(v[1])
      })
    })
  })
})

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
