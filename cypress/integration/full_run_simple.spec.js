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

  beforeEach(() => {
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

  it('navigates the RRSP Deductions page', function() {
    //DEDUCTIONS RRSP
    cy.url().should('contain', '/deductions/rrsp')
    cy.get('h1').should(
      'contain',
      'Deduct your Registered Retirement Savings Plan (RRSP) contributions',
    )

    cy.get('input#rrspClaim1 + label').should('have.attr', 'for', 'rrspClaim1')

    cy.get('input#rrspClaim1').click()

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

  it('navigates the Medical Deductions page', function() {
    //DEDUCTIONS MEDICAL
    cy.injectAxe()
    cy.checkA11y()
    cy.url().should('contain', '/deductions/medical')
    cy.get('h1').should('contain', 'Claim medical expenses')

    cy.get('input#medicalExpenseClaim1 + label').should('have.attr', 'for', 'medicalExpenseClaim1')

    cy.get('input#medicalExpenseClaim1').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Political Deductions page', function() {
    //DEDUCTIONS POLITICAL
    cy.url().should('contain', '/deductions/political')
    cy.get('h1').should('contain', 'Deduct political contributions')

    cy.get('input#politicalContributionClaim1 + label').should(
      'have.attr',
      'for',
      'politicalContributionClaim1',
    )

    cy.get('input#politicalContributionClaim1').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Donations Deductions page', function() {
    //DEDUCTIONS DONATIONS
    cy.url().should('contain', '/deductions/donations')
    cy.get('h1').should('contain', 'Deduct charitable donations')

    cy.get('input#charitableDonationClaim1 + label').should(
      'have.attr',
      'for',
      'charitableDonationClaim1',
    )

    cy.get('input#charitableDonationClaim1').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Start page', function() {
    //TRILLIUM START PAGE
    cy.url().should('contain', '/trillium/start')
    cy.get('h1').should('contain', 'The Ontario Trillium Benefit')

    cy.get(`a[href="/trillium/rent"]`)
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Rent page', function() {
    //TRILLIUM RENT
    cy.url().should('contain', '/trillium/rent')
    cy.get('h1').should('contain', 'Apply for OTB: rent payments')

    cy.get('input#trilliumRentClaim1 + label').should('have.attr', 'for', 'trilliumRentClaim1')

    cy.get('input#trilliumRentClaim1').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Property Tax page', function() {
    //TRILLIUM PROPERTY TAX
    cy.url().should('contain', '/trillium/propertyTax')
    cy.get('h1').should('contain', 'Apply for OTB: property tax')

    cy.get('input#trilliumPropertyTaxClaim1 + label').should(
      'have.attr',
      'for',
      'trilliumPropertyTaxClaim1',
    )

    cy.get('input#trilliumPropertyTaxClaim1').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Student Residence page', function() {
    //TRILLIUM STUDENT RESIDENCE
    cy.url().should('contain', '/trillium/studentResidence')
    cy.get('h1').should('contain', 'Student residence')
    cy.get('input#trilliumStudentResidence1 + label').should(
      'have.attr',
      'for',
      'trilliumStudentResidence1',
    )

    cy.get('input#trilliumStudentResidence1').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Home Energy page', function() {
    //TRILLIUM HOME ENERGY
    cy.url().should('contain', '/trillium/energy')
    cy.get('h1').should('contain', 'Home energy costs on reserve')

    cy.get('input#trilliumEnergyClaim1 + label').should('have.attr', 'for', 'trilliumEnergyClaim1')

    cy.get('input#trilliumEnergyClaim1').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Trillium Long Term Care page', function() {
    //TRILLIUM LONG TERM CARE
    cy.url().should('contain', '/trillium/longTermCare')
    cy.get('h1').should('contain', 'Public long-term care home costs')
    cy.get('input#trilliumLongTermCareClaim1 + label').should(
      'have.attr',
      'for',
      'trilliumLongTermCareClaim1',
    )

    cy.get('input#trilliumLongTermCareClaim1').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Climate Action Incentive page', function() {
    //CLIMATE ACTION INCENTIVE
    cy.url().should('contain', '/deductions/climate-action-incentive')
    cy.get('h1').should('contain', 'Climate Action Incentive')

    cy.get('input#climateActionIncentiveIsRural1 + label').should(
      'have.attr',
      'for',
      'climateActionIncentiveIsRural1',
    )

    cy.get('input#climateActionIncentiveIsRural1').click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click()
  })

  it('navigates the Check Your Answers page', function() {
    cy.url().should('contain', '/checkAnswers')
    cy.get('h1').should('contain', 'Check Your Answers Before Filing Your Return')
    cy.fixture('checkAnswersRows.json').then(rows => {
      checkTableRows(cy, rows.rows)
    })
    cy.get('.buttons-row a')
      .contains('Confirm')
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
      .should('contain', 'Submit my return')
      .click()
  })

  it('checks the Confirmation page', function() {
    // CONFIRMATION PAGE
    cy.url().should('contain', '/confirmation')
    cy.get('h1').should('contain', 'You have filed your 2018 taxes')
    cy.get('th').should('contain', 'Your 2018 filing number is')
    cy.get('td').should('contain', '5H3P9IO5816')
  })
})
