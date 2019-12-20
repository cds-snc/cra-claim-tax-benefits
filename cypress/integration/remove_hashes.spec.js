const { checkTableRows, getBenefitsBreakdownRows, getAddress } = require('../utils.js')

describe('Removes hashes from URLs between form submit redirects', function() {
  before(function() {
    cy.visit('/clear')
    cy.visit('/')
  })

  beforeEach(() => {
    cy.fixture('user').as('user')
    cy.injectAxe().checkA11y()
  })

  it('removes the #code hash after submitting a BAD code', function() {
    cy.visit('/login/code')
    // cause a validation error by clicking "continue" without a code
    cy.code()

    // clicking the validation error at the top puts an anchor link in the URL
    cy.get('.error-list__link').click()
    cy.url().should('contain', 'login/code#code')

    // fill in the WRONG code and continue
    cy.code({ code: 'BAD CODE' })

    // check that #code is not part of the URL anymore
    cy.url().should('not.contain', '#code')
  })

  it('removes the #code hash after submitting a GOOD code', function() {
    cy.visit('/login/code')
    // cause a validation error by clicking "continue" without a code
    cy.code()

    // clicking the validation error at the top puts an anchor link in the URL
    cy.get('.error-list__link').click()
    cy.url().should('contain', 'login/code#code')

    // fill in the correct code and continue
    cy.code({ code: this.user.login.code })

    // check that #code is not part of the URL anymore
    cy.url().should('not.contain', '#code')
  })

  it('removes the #content hash after submitting a good code', function() {
    cy.visit('/login/code')

    // click the skip link, causing an anchor link in the URL
    cy.get('#skip-link')
      .focus()
      .click()
    cy.url().should('contain', 'login/code#content')

    // fill in the correct code and continue
    cy.code({ code: this.user.login.code })

    // check that #code is not part of the URL anymore
    cy.url().should('not.contain', '#content')
  })
})
