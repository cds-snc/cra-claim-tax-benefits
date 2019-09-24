const API = require('./../../api')
const { formatAnswerInfo } = require('./checkAnswersFormat')

const initialSession = API.getUser('A5G98S4K1')

const sessionWithRent = {
  ...initialSession,
  ...{
    deductions: { 
      trilliumRentClaim: true,
      trilliumRentAmount: 240
    }
  }
}

const sessionWithPolitical = {
  ...initialSession,
  ...{
    deductions: {
      politicalContributionClaim: true,
      politicalFederalAmount: 7.00,
      politicalProvincialAmount: 10.00
    }
  }
}

describe('Test checkAnswersFormat function with initialSession', () => { 
  const answerInfo = formatAnswerInfo(initialSession)
  
  test('it has 3 sections with correct key names', async () => {
    expect(Object.keys(answerInfo).length).toBe(3)
    expect(Object.keys(answerInfo)).toEqual(['Personal Information', 'Tax Claims', 'Tax Benefits'])
  })

  test('it has sections with row lengths of 6, 4, 5', async () => {
    expect(answerInfo['Personal Information'].length).toBe(6)
    expect(answerInfo['Tax Claims'].length).toBe(4)
    expect(answerInfo['Tax Benefits'].length).toBe(5)
  })

  test('it has No in all Tax related rows', async () => {
    const taxSections = answerInfo['Tax Benefits'].concat(answerInfo['Tax Claims'])
    taxSections.map((row) => {
      expect(row.data).toBe('No')
    })
  })
})

describe('Test checkAnswersFormat with added displayIf rows for Political Contribution', () => {
  const answerInfo = formatAnswerInfo(sessionWithPolitical)
  
  test('it has an extra row in Tax Claims for political contribution amount', async () => {
    expect(answerInfo['Tax Claims'].length).toBe(5)
  })

  test('it adds the political contribution amount', async () => {
    const politicalAmount = answerInfo['Tax Claims'].find(row => row.urlPath === '/deductions/political/amount')
    expect(politicalAmount.data).toBe(17)
  })
})

describe('Test checkAnswersFormat with added displayIf rows for Trillium Rent', () => {
  const answerInfo = formatAnswerInfo(sessionWithRent)
  
  test('it has an extra row in Tax Benefits for trillium rent amount', async () => {
    expect(answerInfo['Tax Benefits'].length).toBe(6)
  })

  test('it displays the amount', async () => {
    const rentAmount = answerInfo['Tax Benefits'].find(row => row.urlPath === '/trillium/rent/amount')
    expect(rentAmount.data).toBe(240)
  })
})


