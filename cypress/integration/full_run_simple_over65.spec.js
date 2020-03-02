const { checkTableRows, getBenefitsBreakdownRows, getAddress } = require('../utils.js')

describe('Full run through saying "no" to everything', function() {
  before(function() {
    cy.visit('/clear')
    cy.visit('/')
  })

  beforeEach(() => {
    cy.fixture('userAbove65').as('user')
    cy.injectAxe().checkA11y()
  })

  // START PAGE
  it('successfully loads the home page', function() {
    cy.checkA11y()
    cy.get('h1').should('contain', 'File taxes to access benefits')
    cy.get('main a')
      .should('contain', 'Check now')
      .click()
  })

  it('successfully logs in', function() {
    cy.login(this.user, true)
  })

  //CONFIRM NAME
  it('navigates the Confirm Name page', function() {
    cy.confirm({
      url: '/personal/name',
      h1: 'Check your name is correct',
      id: 'name',
    })
    cy.continue()
  })

  //CONFIRM MAILING
  it('navigates the Confirm Mailing page', function() {
    cy.confirm({
      url: '/personal/address',
      h1: 'Check your mailing address',
      id: 'confirmAddress',
    })

    //format address based on apartment/no apartment
    const addressText = getAddress(this.user.personal.address)
    addressText.map((text, index) => {
      cy.get('div.address div')
        .eq(index)
        .should('contain', text)
    })

    cy.continue()
  })

  //CONFIRM MARITAL STATUS
  it('navigates the Confirm Marital Status page', function() {
    cy.confirm({
      url: '/personal/maritalStatus',
      h1: 'Check your marital status',
      id: 'confirmMaritalStatus',
    })

    cy.continue()
  })

  //SENIOR PUBLIC TRANSIT TAX CREDIT
  it('navigates the Senior Public Transit Tax Credit page', function() {
    cy.confirm({
      url: '/deductions/senior-public-transit',
      h1: `Senior’s public transit`,
      id: 'seniorTransitClaim1',
    })

    cy.continue()
  })

  //CLIMATE ACTION INCENTIVE
  it('navigates Climate Action Incentive page', function() {
    cy.confirm({
      url: '/deductions/climate-action-incentive',
      h1: 'Census Metropolitan Area',
      id: 'climateActionIncentiveIsRural1', // click No
    })

    cy.continue()
  })

  //TRILLIUM RENT
  it('navigates the Trillium Rent page', function() {
    cy.confirm({
      url: '/trillium/rent',
      h1: 'Rent',
      id: 'trilliumRentClaim1', // click No
    })

    cy.continue()
  })

  //TRILLIUM PROPERTY TAX
  it('navigates the Trillium Property Tax page', function() {
    cy.confirm({
      url: '/trillium/propertyTax',
      h1: 'Home that you owned',
      id: 'trilliumPropertyTaxClaim1', // click No
    })

    cy.continue()
  })

  //TRILLIUM LONG TERM CARE
  it('navigates the Trillium Long Term Care page', function() {
    cy.confirm({
      url: '/trillium/longTermCare',
      h1: 'Long-term care home',
      id: 'trilliumLongTermCareClaim1', // click No
    })

    cy.continue()
  })

  //TRILLIUM HOME ENERGY
  it('navigates the Trillium Home Energy page', function() {
    cy.confirm({
      url: '/trillium/energy/reserve',
      h1: 'Home on reserve',
      id: 'trilliumEnergyReserveClaim1', // click No
    })

    cy.continue()
  })

  // VOTER OPT IN
  it('navigates Voter Opt In page', function() {
    cy.confirm({
      url: '/vote/optIn',
      h1: 'Vote in the federal election',
      id: 'confirmOptIn1', // click No
    })

    cy.continue()
  })

  // CONFIRM INCOME
  it('navigates Confirm Income page', function() {
    cy.get('p').first().should('contain', '$19,564')

    cy.confirm({
      url: '/confirm-income',
      h1: 'Confirm 2019 income',
      id: 'confirmIncome',
    })

    cy.continue()
  })

  // CHECK ANSWERS
  it('navigates the Check Your Answers page', function() {
    cy.url().should('contain', '/checkAnswers')
    cy.get('h1').should('contain', 'Check your answers before filing')
    cy.fixture('checkAnswersRows.json').then(rows => {
      checkTableRows(cy, rows.rows, 'dt.breakdown-table__row-key')
    })

    cy.get('.buttons-row a')
      .contains('Accept and file')
      .click()
  })

  // CONFIRMATION PAGE
  it('checks the Confirmation page', function() {
    cy.url().should('contain', '/confirmation')
    cy.get('h1').should('contain', 'You have finished filing your 2019 taxes')
    cy.get('th').should('contain', 'Your filing code')
    cy.get('td').should('contain', '5H3P9IO5816')
    checkTableRows(cy, getBenefitsBreakdownRows(this.user), 'dt.breakdown-table__row-key')
  })
})
