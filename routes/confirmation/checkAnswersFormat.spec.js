const API = require('./../../api')
const { formatAnswerInfo } = require('./checkAnswersFormat')

const initialSession = API.getUser('A5G98S4K1')

const sessionWithRent = {
  ...initialSession,
  ...{
    deductions: {
      trilliumRentClaim: true,
      trilliumRentAmount: '240',
    },
  },
}

describe('Test checkAnswersFormat function with initialSession', () => {
  const answerInfo = formatAnswerInfo(initialSession)

  test('it has 2 sections with correct key names', async () => {
    expect(Object.keys(answerInfo).length).toBe(2)
    expect(Object.keys(answerInfo)).toEqual(['Personal information', 'Tax benefits'])
  })

  test('it has sections with row lengths of 6, 6', async () => {
    expect(answerInfo['Personal information'].length).toBe(6)
    expect(answerInfo['Tax benefits'].length).toBe(6)
  })
})

describe('Test checkAnswersFormat with added displayIf rows for Trillium Rent', () => {
  const answerInfo = formatAnswerInfo(sessionWithRent)

  test('it has an extra row in Tax Benefits for trillium rent amount', async () => {
    expect(answerInfo['Tax benefits'].length).toBe(7)
  })

  test('it displays the amount', async () => {
    const rentAmount = answerInfo['Tax benefits'].find(
      row => row.urlPath === '/trillium/rent/amount',
    )
    expect(rentAmount.data).toBe('$240.00')
  })
})
