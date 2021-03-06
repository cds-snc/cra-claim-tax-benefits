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

const sessionWithVoterRegistration = {
  ...initialSession,
  ...{
    vote: {
      confirmOptIn: 'Yes',
      citizen: 'Yes',
      register: 'Yes',
    },
  },
}

describe('Test checkAnswersFormat function with initialSession', () => {
  const answerInfo = formatAnswerInfo({ session: initialSession })

  test('it has 4 sections with correct key names', async () => {
    expect(Object.keys(answerInfo).length).toBe(4)
    expect(Object.keys(answerInfo)).toEqual([
      'Personal information',
      'Tax benefits',
      'Voter registration',
      'Income',
    ])
  })

  test('it has sections with row lengths of 4 and 5', async () => {
    expect(answerInfo['Personal information'].length).toBe(4)
    expect(answerInfo['Tax benefits'].length).toBe(5)
  })
})

describe('Test checkAnswersFormat with added displayIf rows for Trillium Rent', () => {
  const answerInfo = formatAnswerInfo({ session: sessionWithRent })

  test('it has an extra row in Tax Benefits for trillium rent amount', async () => {
    expect(answerInfo['Tax benefits'].length).toBe(6)
  })

  test('it displays the amount', async () => {
    const rentAmount = answerInfo['Tax benefits'].find(
      row => row.urlPath === '/trillium/rent/amount',
    )
    expect(rentAmount.data).toBe('$240.00')
  })
})

describe('Test checkAnswersFormat with added displayIf rows for Voter registration', () => {
  const answerInfo = formatAnswerInfo({ session: sessionWithVoterRegistration })

  test('it has extra rows in Voter registration', async () => {
    expect(answerInfo['Voter registration'].length).toBe(3)
  })
})

describe('Test checkAnswersFormat returns correct locale format for date', () => {
  test('it displays french format when set to fr', async () => {
    const answerInfo = formatAnswerInfo({ session: initialSession, locale: 'fr' })

    const birthDay = answerInfo['Personal information'].find(
      row => row.infoPath[0] === 'personal.dateOfBirth',
    )

    expect(birthDay.data).toBe('9 septembre 1977')
  })

  test('it displays english format when no locale', async () => {
    const answerInfo = formatAnswerInfo({ session: initialSession })

    const birthDay = answerInfo['Personal information'].find(
      row => row.infoPath[0] === 'personal.dateOfBirth',
    )

    expect(birthDay.data).toBe('9 September 1977')
  })
})
