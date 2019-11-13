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
      value: source.total,
    }
    incomeRows.push(incomeRow)
    return
  })

  incomeRows.push({
    key: 'Total Income',
    value: user.financial.incomes.totalIncome.amount,
  })

  return incomeRows
}

const getTaxBreakdownRows = user => {
  const taxKeys = Object.values(user.financial.taxes)
  const taxRows = taxKeys.map(source => {
    return {
      key: `${source.name.replace('Net ', '')} deduction`,
      value: source.amount,
    }
  })

  taxRows.push({
    key: 'Total tax paid for 2018',
    value: user.financial.totalTax,
  })

  return taxRows
}

const getBenefitsBreakdownRows = user => {
  const benefitsKeys = Object.values(user.benefits);
  const benefitsRows = benefitsKeys.map(source => {
    return {
      key: source.name,
      value: source.amount,
    }
  })

  return benefitsRows
}

const allIncomeRows = user => getIncomeBreakdownRows(user).concat(getTaxBreakdownRows(user))

const getAddress = address => {
  const fullAddress = [`${address.city}, ${address.province}`, `${address.postalCode}`]
  if (address.line2.en && address.line2.en !== '') {
    fullAddress.unshift(`${address.line2.en}-${address.line1.en}`)
  } else {
    fullAddress.unshift(`${address.line1.en}`)
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
  cy.get('h1').should('contain', 'Enter your Social insurance number (SIN)')
  cy.get('h2').should('contain', `${user.personal.firstName}, thanks for your filing code.`)
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
    .eq(3)
    .should('have.attr', 'for', 'securityQuestion3')
  cy.get('#securityQuestion3').check()

  cy.get('form button[type="submit"]')
    .should('contain', 'Continue')
    .click()

  // LOGIN TRILLIUM QUESTION
  cy.injectAxe().checkA11y()
  cy.url().should('contain', '/login/questions/dateOfResidence')
  cy.get('h1').should('contain', 'Enter date you became a resident of Canada')

  cy.get('form label')
    .eq(0)
    .should('have.attr', 'for', 'dobDay')
  cy.get('#dobDay')
    .type('1')
    .should('have.value', '1')

  cy.get('form label')
    .eq(1)
    .should('have.attr', 'for', 'dobMonth')
  cy.get('#dobMonth')
    .type('2')
    .should('have.value', '2')

  cy.get('form label')
    .eq(2)
    .should('have.attr', 'for', 'dobYear')
  cy.get('#dobYear')
    .type('1997')
    .should('have.value', '1997')

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
