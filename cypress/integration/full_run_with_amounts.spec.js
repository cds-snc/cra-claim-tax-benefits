const {
  checkTableRows,
  allIncomeRows,
  getBenefitsBreakdownRows,
  getAddress,
  logIn,
} = require('../utils.js')

describe('Full run through', function() {
  before(function() {
    cy.visit('/clear')
    cy.visit('/')
  })

  beforeEach(function() {
    cy.fixture('user').as('user')
    cy.injectAxe().checkA11y()
  })

  it('successfully loads the home page', function() {
    // START PAGE
    cy.checkA11y()
    cy.get('h1').should('contain', 'Claim Tax Benefits')
    cy.get('main a')
      .should('contain', 'Start now')
      .click()
  })

  it('successfully logs in', function() {
    logIn(cy, this.user)
  })

  it('navigates the Confirm Name page', function() {
    //CONFIRM NAME
    cy.url().should('contain', '/personal/name')
    cy.get('h1').should('contain', 'Check your name is correct')

    cy.get('input#name0 + label').should('have.attr', 'for', 'name0')

    cy.get('input#name0').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Confirm Residence page', function() {
    //CONFIRM RESIDENCE
    cy.url().should('contain', '/personal/residence')
    cy.get('h1').should('contain', 'Enter your province or territory')

    cy.get('form label').should('have.attr', 'for', 'residence')

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Confirm Mailing page', function() {
    //CONFIRM MAILING
    cy.url().should('contain', '/personal/address')
    cy.get('h1').should('contain', 'Check your mailing address')

    //format address based on apartment/no apartment
    const addressText = getAddress(this.user.personal.address)

    addressText.map((text, index) => {
      cy.get('div.address div')
        .eq(index)
        .should('contain', text)
    })

    cy.get('input#confirmAddress0 + label').should('have.attr', 'for', 'confirmAddress0')

    cy.get('input#confirmAddress0').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Confirm Income page', function() {
    //CONFIRM INCOME
    cy.url().should('contain', '/financial/income')
    cy.get('h1').should('contain', 'Check your income information for the 2018 tax year')

    //check table data
    checkTableRows(cy, allIncomeRows(this.user))

    cy.get('input#confirmIncome0 + label').should('have.attr', 'for', 'confirmIncome0')

    cy.get('input#confirmIncome0').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Confirm Marital Status page', function() {
    //CONFIRM MARITAL STATUS
    cy.url().should('contain', '/personal/maritalStatus')
    cy.get('h1').should('contain', 'Check your marital status')

    cy.get('input#confirmMaritalStatus0 + label').should(
      'have.attr',
      'for',
      'confirmMaritalStatus0',
    )

    cy.get('input#confirmMaritalStatus0').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Rent page', function() {
    //TRILLIUM RENT
    cy.url().should('contain', '/trillium/rent')
    cy.get('h1').should('contain', 'Rent')

    cy.get('input#trilliumRentClaim1 + label').should('have.attr', 'for', 'trilliumRentClaim1')

    cy.get('input#trilliumRentClaim0').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Rent AMOUNT page', function() {
    //TRILLIUM RENT AMOUNT
    cy.url().should('contain', '/trillium/rent/amount')
    cy.get('h1').should('contain', 'Enter your rent')

    cy.get('#trilliumRentAmount__label').should('have.attr', 'for', 'trilliumRentAmount')

    cy.get('input#trilliumRentAmount').should('have.attr', 'placeholder', '0.00').should('have.attr', 'value', '').type('25')

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()

    cy.url().should('contain', '/trillium/propertyTax')
    cy.get('a.back-link').should('contain', 'Go back').click()
    cy.url().should('contain', '/trillium/rent/amount')
    cy.get('input#trilliumRentAmount').should('have.attr', 'value', '25.00')

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Property Tax page', function() {
    //TRILLIUM PROPERTY TAX
    cy.url().should('contain', '/trillium/propertyTax')
    cy.get('h1').should('contain', 'Property tax')

    cy.get('input#trilliumPropertyTaxClaim0 + label').should(
      'have.attr',
      'for',
      'trilliumPropertyTaxClaim0',
    )

    cy.get('input#trilliumPropertyTaxClaim0').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Property Tax AMOUNT page', function() {
    //TRILLIUM PROPERTY TAX AMOUNT
    cy.url().should('contain', '/trillium/propertyTax/amount')
    cy.get('h1').should('contain', 'Enter your property tax')

    cy.get('#trilliumPropertyTaxAmount__label').should('have.attr', 'for', 'trilliumPropertyTaxAmount')

    cy.get('input#trilliumPropertyTaxAmount').should('have.attr', 'placeholder', '0.00').should('have.attr', 'value', '').type('25')

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()

    cy.url().should('contain', '/trillium/studentResidence')
    cy.get('a.back-link').should('contain', 'Go back').click()
    cy.url().should('contain', '/trillium/propertyTax/amount')
    cy.get('input#trilliumPropertyTaxAmount').should('have.attr', 'value', '25.00')

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Student Residence page', function() {
    //TRILLIUM STUDENT RESIDENCE
    cy.url().should('contain', '/trillium/studentResidence')
    cy.get('h1').should('contain', 'Student residence')
    cy.get('input#trilliumStudentResidence0 + label').should(
      'have.attr',
      'for',
      'trilliumStudentResidence0',
    )

    cy.get('input#trilliumStudentResidence0').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Home Energy page', function() {
    //TRILLIUM HOME ENERGY
    cy.url().should('contain', '/trillium/energy/reserve')
    cy.get('h1').should('contain', 'Home on reserve')

    cy.get('input#trilliumEnergyReserveClaim0 + label').should('have.attr', 'for', 'trilliumEnergyReserveClaim0')

    cy.get('input#trilliumEnergyReserveClaim0').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Energy Cost page', function() {
    //TRILLIUM HOME ENERGY COST
    cy.url().should('contain', '/trillium/energy/cost')
    cy.get('h1').should('contain', 'Home energy costs on reserve')

    cy.get('input#trilliumEnergyCostClaim0 + label').should('have.attr', 'for', 'trilliumEnergyCostClaim0')

    cy.get('input#trilliumEnergyCostClaim0').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Energy Cost AMOUNT page', function() {
    //TRILLIUM HOME ENERGY COST AMOUNT
    cy.url().should('contain', '/trillium/energy/cost/amount')
    cy.get('h1').should('contain', 'Enter your home energy costs')

    cy.get('#trilliumEnergyAmount__label').should('have.attr', 'for', 'trilliumEnergyAmount')

    cy.get('input#trilliumEnergyAmount').should('have.attr', 'placeholder', '0.00').should('have.attr', 'value', '').type('25')

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()

    cy.url().should('contain', '/trillium/longTermCare')
    cy.get('a.back-link').should('contain', 'Go back').click()
    cy.url().should('contain', '/trillium/energy/cost/amount')
    cy.get('input#trilliumEnergyAmount').should('have.attr', 'value', '25.00')

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Long Term Care page', function() {
    //TRILLIUM LONG TERM CARE
    cy.url().should('contain', '/trillium/longTermCare')
    cy.get('h1').should('contain', 'Long-term care home')
    cy.get('input#trilliumLongTermCareClaim0 + label').should(
      'have.attr',
      'for',
      'trilliumLongTermCareClaim0',
    )

    cy.get('input#trilliumLongTermCareClaim0').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Long Term Care Type page', function() {
    //TRILLIUM LONG TERM CARE TYPE
    cy.url().should('contain', '/trillium/longTermCare/type')
    cy.get('h1').should('contain', 'Public or non-profit long-term care')
    cy.get('input#trilliumLongTermCareTypeClaim0 + label').should(
      'have.attr',
      'for',
      'trilliumLongTermCareTypeClaim0',
    )

    cy.get('input#trilliumLongTermCareTypeClaim0').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Long Term Care AMOUNT page', function() {
    //TRILLIUM LONG TERM CARE AMOUNT
    cy.url().should('contain', '/trillium/longTermCare/type/amount')
    cy.get('h1').should('contain', 'Enter your long-term care home costs')

    cy.get('#trilliumLongTermCareAmount__label').should('have.attr', 'for', 'trilliumLongTermCareAmount')

    cy.get('input#trilliumLongTermCareAmount').should('have.attr', 'placeholder', '0.00').should('have.attr', 'value', '').type('25')

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()

    cy.url().should('contain', '/deductions/climate-action-incentive')
    cy.get('a.back-link').should('contain', 'Go back').click()
    cy.url().should('contain', '/trillium/longTermCare/type/amount')
    cy.get('input#trilliumLongTermCareAmount').should('have.attr', 'value', '25.00')

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates  Incentive page', function() {
    //CLIMATE ACTION INCENTIVE
    cy.url().should('contain', '/deductions/climate-action-incentive')
    cy.get('h1').should('contain', 'Small and rural communities')

    cy.get('input#climateActionIncentiveIsRural0 + label').should(
      'have.attr',
      'for',
      'climateActionIncentiveIsRural0',
    )

    cy.get('input#climateActionIncentiveIsRural0').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Check Your Answers page', function() {
    cy.url().should('contain', '/checkAnswers')
    cy.get('h1').should('contain', 'Check your answers before filing')
    cy.fixture('checkAnswersRowsWithAmounts.json').then(rows => {
      checkTableRows(cy, rows.rows)
    })
    cy.get('.buttons-row a')
      .contains('Agree')
      .click()
  })

  it('navigates the Review page', function() {
    //REVIEW
    cy.url().should('contain', '/review')
    cy.get('h1').should('contain', 'Review and file tax return')

    //check some table data
    //until we have a more firm grasp on how we're shaping the total refund, i'm just checking benefits
    checkTableRows(cy, getBenefitsBreakdownRows(this.user))

    cy.get('input#review + label').should('have.attr', 'for', 'review')

    cy.get('input#review').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'File your taxes now')
      .click()
  })

  it('checks the Confirmation page', function() {
    // CONFIRMATION PAGE
    cy.url().should('contain', '/confirmation')
    cy.get('h1').should('contain', 'You have filed your 2018 taxes')
    cy.get('th').should('contain', 'Your 2018 filing code is')
    cy.get('td').should('contain', '5H3P9IO5816')
  })
})
