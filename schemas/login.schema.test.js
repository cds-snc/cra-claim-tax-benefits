const { lastDayInMonth } = require('./index')

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
