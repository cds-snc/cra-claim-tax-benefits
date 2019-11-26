const {
  checkTableRows,
  allIncomeRows,
  getBenefitsBreakdownRows,
  getAddress,
} = require('../utils.js')

describe('Full run through saying "no" to everything', function() {
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
    cy.get('h1').should('contain', 'Claim Tax Benefits')
    cy.get('main a')
      .should('contain', 'Start now')
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
      id: 'name0',
    })
    cy.continue()
  })

  //CONFIRM RESIDENCE
  it('navigates the Confirm Residence page', function() {
    cy.confirm({
      url: '/personal/residence',
      h1: 'Enter your province or territory',
      id: 'residence',
    })
    cy.continue()
  })

  //CONFIRM MAILING
  it('navigates the Confirm Mailing page', function() {
    cy.confirm({
      url: '/personal/address',
      h1: 'Check your mailing address',
      id: 'confirmAddress0',
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
      id: 'confirmMaritalStatus0',
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
      h1: 'Property tax',
      id: 'trilliumPropertyTaxClaim1', // click No
    })

    cy.continue()
  })

  //TRILLIUM STUDENT RESIDENCE
  it('navigates the Trillium Student Residence page', function() {
    cy.confirm({
      url: '/trillium/studentResidence',
      h1: 'Student residence',
      id: 'trilliumStudentResidence1', // click No
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

  //TRILLIUM LONG TERM CARE
  it('navigates the Trillium Long Term Care page', function() {
    cy.confirm({
      url: '/trillium/longTermCare',
      h1: 'Long-term care home',
      id: 'trilliumLongTermCareClaim1', // click No
    })

    cy.continue()
  })

  //CLIMATE ACTION INCENTIVE
  it('navigates Climate Action Incentive page', function() {
    cy.confirm({
      url: '/deductions/climate-action-incentive',
      h1: 'Small and rural communities',
      id: 'climateActionIncentiveIsRural1', // click No
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

  it('navigates Security Questions', function() {
    // LOGIN SECURITY QUESTIONS
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/login/securityQuestion')
    cy.get('h1').should('contain', 'Choose a security question')

    cy.get('form label')
      .eq(3)
      .should('have.attr', 'for', 'securityQuestion3')
    cy.get('#securityQuestion3').check()

    cy.get("form button[type='submit']")
      .should('contain', 'Continue')
      .click() 

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
  })

  //CONFIRM INCOME
  it('navigates the Confirm Income page', function() {
    cy.confirm({
      url: '/financial/income',
      h1: 'Check your income information for the 2018 tax year',
      id: 'confirmIncome0',
    })

    checkTableRows(cy, allIncomeRows(this.user))

    cy.continue()
  })

  // CHECK ANSWERS
  it('navigates the Check Your Answers page', function() {
    cy.url().should('contain', '/checkAnswers')
    cy.get('h1').should('contain', 'Check your answers before filing')
    cy.fixture('checkAnswersRows.json').then(rows => {
      checkTableRows(cy, rows.rows)
    })

    cy.get('.buttons-row a')
      .contains('Agree')
      .click()
  })

  //REVIEW
  it('navigates the Review page', function() {
    cy.confirm({
      url: '/review',
      h1: 'Review and file tax return',
      id: 'review', // click checkbox
    })

    //check some table data
    //until we have a more firm grasp on how we're shaping the total refund, i'm just checking benefits
    checkTableRows(cy, getBenefitsBreakdownRows(this.user))

    cy.continue('File your taxes now')
  })

  // CONFIRMATION PAGE
  it('checks the Confirmation page', function() {
    cy.url().should('contain', '/confirmation')
    cy.get('h1').should('contain', 'You have filed your 2018 taxes')
    cy.get('th').should('contain', 'Your 2018 filing code is')
    cy.get('td').should('contain', '5H3P9IO5816')
  })
})
