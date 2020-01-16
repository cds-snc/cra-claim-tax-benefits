// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'
import 'cypress-axe'

Cypress.Cookies.defaults({
  whitelist: '_csrf',
})

Cypress.Commands.add('login', user => {
  // ELIGIBILITY AGE
  cy.injectAxe().checkA11y()
  cy.url().should('contain', '/eligibility/age')
  cy.get('h1').should('contain', 'Age 65 and above')

  cy.get(`input#ageYesNo1 + label`).should('have.attr', 'for', 'ageYesNo1')
  cy.get(`input#ageYesNo1`).click()

  cy.continue()

  // ELIGIBILITY TAXABLE INCOME
  cy.injectAxe().checkA11y()
  cy.confirm({
    url: '/eligibility/taxable-income',
    h1: '2019 Income',
    id: 'taxableIncome0',
  })
  cy.continue()

  // ELIGIBILITY RESIDENCE
  cy.injectAxe().checkA11y()
  cy.url().should('contain', '/eligibility/residence')
  cy.get('h1').should('contain', 'Province or territory of home address')

  cy.get(`input#residenceScreening0 + label`).should('have.attr', 'for', 'residenceScreening0')
  cy.get(`input#residenceScreening0`).click()

  cy.continue()

  // ELIGIBILITY CHILDREN
  cy.injectAxe().checkA11y()
  cy.confirm({
    url: '/eligibility/children',
    h1: 'Children under 18',
    id: 'children1',
  })
  cy.continue()

  // ELIGIBILITY DEPENDENTS
  cy.injectAxe().checkA11y()
  cy.confirm({
    url: '/eligibility/dependents',
    h1: 'Eligible dependents',
    id: 'eligibleDependents1',
  })
  cy.continue()

  // ELIGIBILITY TUITION
  cy.injectAxe().checkA11y()
  cy.confirm({
    url: '/eligibility/tuition',
    h1: '2019 tuition',
    id: 'tuition1',
  })
  cy.continue()

  // ELIGIBILITY INCOME SOURCES
  cy.injectAxe().checkA11y()
  cy.confirm({
    url: '/eligibility/income-sources',
    h1: 'Income sources',
    id: 'incomeSources1',
  })
  cy.continue()

  // ELIGIBILITY FOREIGN INCOME
  cy.injectAxe().checkA11y()
  cy.confirm({
    url: '/eligibility/foreign-income',
    h1: 'Foreign income',
    id: 'foreignIncome1',
  })
  cy.continue()

  // ELIGIBILITY SUCCESS
  cy.injectAxe().checkA11y()
  cy.url().should('contain', '/eligibility/success')
  cy.get('h1').should('contain', 'You can file taxes with this service')
  cy.get('a[href="/login/code"]').click()

  // LOGIN CODE
  cy.injectAxe().checkA11y()
  cy.url().should('contain', '/login/code')
  cy.code({ code: user.login.code })

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
  cy.get('h2').should(
    'contain',
    `${user.personal.firstName}, thanks for your Social insurance number.`,
  )
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
})

Cypress.Commands.add('code', ({ code } = {}) => {
  cy.get('h1').should('contain', 'Enter your personal filing code')
  cy.get('form label').should('have.attr', 'for', 'code')
  if (code) {
    cy.get('form input#code')
      .type(code)
      .should('have.value', code)
  }
  cy.continue()
})

Cypress.Commands.add('confirm', ({ url, h1, id }) => {
  cy.url().should('contain', url)
  cy.get('h1').should('contain', h1)

  if (url.endsWith('/residence')) {
    cy.get('form label').should('have.attr', 'for', id)
  } else {
    cy.get(`input#${id} + label`).should('have.attr', 'for', id)
    cy.get(`input#${id}`).click()
  }
})

Cypress.Commands.add('amount', ({ url, h1, id }) => {
  cy.url().should('contain', url)
  cy.get('h1').should('contain', h1)

  cy.get(`#${id}__label`).should('have.attr', 'for', id)

  cy.get(`input#${id}`)
    .should('have.attr', 'placeholder', '0.00')
    .clear()
    .type('25')
})

Cypress.Commands.add('continue', (label = 'Continue') => {
  cy.get('form button[type="submit"]')
    .should('contain', label)
    .click()
})
