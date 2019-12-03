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

const sessionWithSecurityQuestion = {
  ...initialSession,
  ...{
    login: {
      securityQuestion: [[true, '/login/questions/child'], [true, '/login/questions/dateOfResidence']],
    },
  },
}

const sessionWithVoterRegistration = {
  ...initialSession,
  ...{
    vote: {
      confirmOptIn: 'Yes',
      voterCitizen: 'Yes',
      voterConsent: 'Yes',
    },
  },
}

describe('Test checkAnswersFormat function with initialSession', () => {
  const answerInfo = formatAnswerInfo({ session: initialSession })

  test('it has 3 sections with correct key names', async () => {
    expect(Object.keys(answerInfo).length).toBe(3)
    expect(Object.keys(answerInfo)).toEqual([
      'Personal information',
      'Tax benefits',
      'Voter Registration',
    ])
  })

  test('it has sections with row lengths of 5 and 6', async () => {
    expect(answerInfo['Personal information'].length).toBe(5)
    expect(answerInfo['Tax benefits'].length).toBe(6)
  })
})

describe('Test checkAnswersFormat with added displayIf row for financial information', () => {
  const answerInfo = formatAnswerInfo({ session: sessionWithSecurityQuestion })

  test('it has an extra row in Personal information for financial info', async () => {
    expect(answerInfo['Personal information'].length).toBe(6)
  })

  test('it displays the word Yes', async () => {
    const financialInfo = answerInfo['Personal information'].find(
      row => row.urlPath === '/financial/income',
    )
    expect(financialInfo.data).toBe('No')
  })
})

describe('Test checkAnswersFormat with added displayIf rows for Trillium Rent', () => {
  const answerInfo = formatAnswerInfo({ session: sessionWithRent })

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

describe('Test checkAnswersFormat with added displayIf rows for Voter Registration', () => {
  const answerInfo = formatAnswerInfo({ session: sessionWithVoterRegistration })

  test('it has extra rows in Voter Registration', async () => {
    expect(answerInfo['Voter Registration'].length).toBe(3)
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
