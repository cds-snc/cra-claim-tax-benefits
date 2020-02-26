const { checkTableRows, getBenefitsBreakdownRows, getAddress } = require('../utils.js')

describe('Full run through saying "yes" to everything', function() {
  before(function() {
    cy.visit('/clear')
    cy.visit('/')
  })

  beforeEach(() => {
    cy.fixture('user').as('user')
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
    cy.login(this.user)
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
      id: 'seniorTransitClaim',
    })

    cy.continue()
  })

  //ENIOR PUBLIC TRANSIT TAX CREDIT **AMOUNT**
  it('navigates the Senior Public Transit Tax Credit AMOUNT page', function() {
    cy.amount({
      url: '/deductions/senior-public-transit/amount',
      h1: 'Enter your total 2019 transit costs',
      id: 'seniorTransitAmount',
    })

    cy.continue()
  })

  //CLIMATE ACTION INCENTIVE
  it('navigates Climate Action Incentive page', function() {
    cy.confirm({
      url: '/deductions/climate-action-incentive',
      h1: 'Census Metropolitan Area',
      id: 'climateActionIncentiveIsRural', // click Yes
    })

    cy.continue()
  })

  //TRILLIUM RENT
  it('navigates the Trillium Rent page', function() {
    cy.confirm({
      url: '/trillium/rent',
      h1: 'Rent',
      id: 'trilliumRentClaim', // click Yes
    })

    cy.continue()
  })

  //TRILLIUM RENT ONTARIO
  it('navigates the Trillium Rent Ontario page', function() {
    cy.confirm({
      url: '/trillium/rent/ontario',
      h1: 'Rent in Ontario',
      id: 'trilliumRentOntario', // click Yes
    })

    cy.continue()
  })

  //TRILLIUM RENT AMOUNT
  it('navigates the Trillium Rent AMOUNT page', function() {
    cy.amount({
      url: '/trillium/rent/amount',
      h1: 'Enter your rent',
      id: 'trilliumRentAmount',
    })

    cy.continue()
  })

  //TRILLIUM PROPERTY TAX
  it('navigates the Trillium Property Tax page', function() {
    cy.confirm({
      url: '/trillium/propertyTax',
      h1: 'Home that you owned',
      id: 'trilliumPropertyTaxClaim', // click Yes
    })

    cy.continue()
  })

  //TRILLIUM PROPERTY TAX ONTARIO
  it('navigates the Trillium Property Tax Ontario page', function() {
    cy.confirm({
      url: '/trillium/propertyTax/ontario',
      h1: 'Home that you owned in Ontario',
      id: 'trilliumPropertyTaxOntario', // click Yes
    })

    cy.continue()
  })

  //TRILLIUM PROPERTY TAX AMOUNT
  it('navigates the Property Tax AMOUNT page', function() {
    cy.amount({
      url: '/trillium/propertyTax/amount',
      h1: 'Enter taxes on home you owned',
      id: 'trilliumPropertyTaxAmount',
    })

    cy.continue()
  })

  //TRILLIUM LONG TERM CARE
  it('navigates the Trillium Long Term Care page', function() {
    cy.confirm({
      url: '/trillium/longTermCare',
      h1: 'Long-term care home',
      id: 'trilliumLongTermCareClaim', // click Yes
    })

    cy.continue()
  })

  //TRILLIUM LONG TERM CARE ONTARIO
  it('navigates the Trillium Long Term Care Ontario page', function() {
    cy.confirm({
      url: '/trillium/longTermCare/ontario',
      h1: 'Long-term care in Ontario',
      id: 'trilliumLongTermCareOntario', // click Yes
    })

    cy.continue()
  })

  //TRILLIUM LONG TERM CARE TYPE
  it('navigates the Trillium Long Term Care Type page', function() {
    cy.confirm({
      url: '/trillium/longTermCare/type',
      h1: 'Public or non-profit long-term care',
      id: 'trilliumLongTermCareTypeClaim', // click Yes
    })

    cy.continue()
  })

  //TRILLIUM LONG TERM CARE ONTARIO
  it('navigates the Trillium Long Term Care Costs page', function() {
    cy.confirm({
      url: '/trillium/longTermCare/cost',
      h1: 'Long-term care home costs',
      id: 'trilliumLongTermCareCost', // click Yes
    })

    cy.continue()
  })

  //TRILLIUM LONG TERM CARE AMOUNT
  it('navigates the Trillium Long Term Care ROOM AND BOARD page', function() {
    cy.amount({
      url: '/trillium/longTermCare/type/roomAndBoard',
      h1: 'Enter your total 2019 room and board costs in long-term care',
      id: 'trilliumLongTermCareRoomAndBoardAmount',
    })

    cy.continue()
  })

  //TRILLIUM HOME ENERGY
  it('navigates the Trillium Home Energy page', function() {
    cy.confirm({
      url: '/trillium/energy/reserve',
      h1: 'Home on reserve',
      id: 'trilliumEnergyReserveClaim', // click Yes
    })

    cy.continue()
  })

  //TRILLIUM HOME ENERGY ONTARIO
  it('navigates the Trillium Home Energy Ontario page', function() {
    cy.confirm({
      url: '/trillium/energy/reserve/ontario',
      h1: 'Home on reserve in Ontario',
      id: 'trilliumEnergyReserveOntario', // click Yes
    })

    cy.continue()
  })

  //TRILLIUM HOME ENERGY COST
  it('navigates the Trillium Home Energy Cost page', function() {
    cy.confirm({
      url: '/trillium/energy/cost',
      h1: 'Home energy costs on reserve',
      id: 'trilliumEnergyCostClaim', // click Yes
    })

    cy.continue()
  })

  //TRILLIUM HOME ENERGY COST AMOUNT
  it('navigates the Trillium Home Energy Cost AMOUNT page', function() {
    cy.amount({
      url: '/trillium/energy/cost/amount',
      h1: 'Enter your home energy costs',
      id: 'trilliumEnergyAmount',
    })

    cy.continue()
  })

  // VOTER OPT IN
  it('navigates Voter Opt In page', function() {
    cy.confirm({
      url: '/vote/optIn',
      h1: 'Vote in the federal election (optional)',
      id: 'confirmOptIn', // click Yes
    })

    cy.continue()
  })

  // VOTER CITIZEN
  it('navigates Voter Citizen page', function() {
    cy.confirm({
      url: '/vote/citizen',
      h1: 'Register to vote - citizenship',
      id: 'citizen', // click Yes
    })

    cy.continue()
  })

  // VOTER REGISTRATION
  it('navigates Voter Registration page', function() {
    cy.confirm({
      url: '/vote/register',
      h1: 'Register or update voter information',
      id: 'register', // click Yes
    })

    cy.continue()
  })

  //CONFIRM INCOME
  it('navigates the Confirm Income page', function() {
    cy.confirm({
      url: '/confirm-income',
      h1: 'Confirm 2019 income',
      id: 'confirmIncome', // click checkbox
    })

    cy.continue('Continue')
  })

  // CHECK ANSWERS
  it('navigates the Check Your Answers page', function() {
    cy.url().should('contain', '/checkAnswers')
    cy.get('h1').should('contain', 'Check your answers before filing')
    cy.fixture('checkAnswersRowsWithAmounts.json').then(rows => {
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
