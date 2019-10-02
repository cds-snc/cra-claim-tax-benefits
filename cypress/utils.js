const { currencyFilter } = require('./../utils')

const checkTableRows = (cy, rows) => {
  rows.map((row, index) => {
    cy.get('dt.breakdown-table__row-key')
      .eq(index)
      .should('contain', row.key)
      .next('dd')
      .should('contain', row.value)
  })
}

const getIncomeBreakdownRows = user => {
  const incomeRows = []

  user.financial.incomeSources.map(source => {
    const incomeRow = {
      key: source.name,
      value: currencyFilter(source.total),
    }
    incomeRows.push(incomeRow)
  })

  incomeRows.push({
    key: 'Total Income',
    value: currencyFilter(user.financial.incomes.totalIncome.amount),
  })

  return incomeRows
}

const getTaxBreakdownRows = user => {
  const taxRows = []

  Object.values(user.financial.taxes).map(source => {
    const taxRow = {
      key: `${source.name.replace('Net ', '')} deduction`,
      value: currencyFilter(source.amount),
    }
    taxRows.push(taxRow)
  })

  taxRows.push({
    key: 'Total tax paid for 2018',
    value: currencyFilter(user.financial.totalTax),
  })

  return taxRows
}

const getBenefitsBreakdownRows = user => {
  const benefitsRows = []

  Object.values(user.benefits).map(source => {
    const benefitsRow = {
      key: source.name,
      value: currencyFilter(source.amount),
    }
    benefitsRows.push(benefitsRow)
  })

  return benefitsRows
}

const allIncomeRows = user => getIncomeBreakdownRows(user).concat(getTaxBreakdownRows(user))

const getAddress = address => {
  const fullAddress = [`${address.city}, ${address.province}`, `${address.postalCode}`]
  if (address.line2 && address.line2 !== '') {
    fullAddress.unshift(`${address.line2}-${address.line1}`)
  } else {
    fullAddress.unshift(`${address.line1}`)
  }

  return fullAddress
}

const logIn = (cy, user) => {
  // LOGIN CODE PAGE
  cy.injectAxe().checkA11y()
  cy.url().should('contain', '/login/code')
  cy.get('h1').should('contain', 'Enter your personal filing code')
  cy.get('form label').should('have.attr', 'for', 'code')
  cy.get('form input#code')
    .type(user.login.code)
    .should('have.value', user.login.code)
  cy.get('form button[type="submit"]')
    .should('contain', 'Continue')
    .click()

  // LOGIN SIN
  cy.injectAxe().checkA11y()
  cy.url().should('contain', '/login/sin')
  cy.get('h1').should('contain', 'Enter your Social Insurance Number (SIN)')
  cy.get('h2').should('contain', `Thanks, ${user.personal.firstName} ${user.personal.lastName}!`)
  cy.get('form label').should('have.attr', 'for', 'sin')
  cy.get('form input#sin')
    .type(user.personal.sin)
    .should('have.value', user.personal.sin)
  cy.get('form button[type="submit"]')
    .should('contain', 'Continue')
    .click()

  // LOGIN DOB
  cy.injectAxe().checkA11y()
  cy.url().should('contain', '/login/dateOfBirth')
  cy.get('h1').should('contain', 'Enter your date of birth')

  cy.get('form label')
    .eq(0)
    .should('have.attr', 'for', 'dobDay')
  cy.get('form label')
    .eq(1)
    .should('have.attr', 'for', 'dobMonth')
  cy.get('form label')
    .eq(2)
    .should('have.attr', 'for', 'dobYear')

  const [dobYear, dobMonth, dobDay] = user.personal.dateOfBirth.split('-')

  cy.get('form input#dobDay')
    .type(dobDay)
    .should('have.value', dobDay)

  cy.get('form input#dobMonth')
    .type(dobMonth)
    .should('have.value', dobMonth)

  cy.get('form input#dobYear')
    .type(dobYear)
    .should('have.value', dobYear)

  cy.get('form button[type="submit"]')
    .should('contain', 'Continue')
    .click()

  // LOGIN SECURITY QUESTIONS
  cy.injectAxe().checkA11y()
  cy.url().should('contain', '/login/securityQuestion')
  cy.get('h1').should('contain', 'Choose a security question')

  cy.get('form label')
    .eq(2)
    .should('have.attr', 'for', 'securityQuestion2')
  cy.get('#securityQuestion2').check()

  cy.get('form button[type="submit"]')
    .should('contain', 'Continue')
    .click()

  // LOGIN TRILLIUM QUESTION
  cy.injectAxe().checkA11y()
  cy.url().should('contain', '/login/questions/trillium')
  cy.get('h1').should('contain', 'Ontario Trillium Benefit amount and payment type')

  cy.get('form label')
    .eq(0)
    .should('have.attr', 'for', 'trilliumPaymentMethod0')
  cy.get('#trilliumPaymentMethod0').check()

  cy.get('form label')
    .eq(2)
    .should('have.attr', 'for', 'trilliumAmount')
  cy.get('#trilliumAmount')
    .type('1')
    .should('have.value', '1')

  cy.get('form button[type="submit"]')
    .should('contain', 'Continue')
    .click()
}

module.exports = {
  checkTableRows,
  allIncomeRows,
  getBenefitsBreakdownRows,
  getAddress,
  logIn,
}
