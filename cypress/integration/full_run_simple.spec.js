const { 
  checkTableRows,
  allIncomeRows,
  getBenefitsBreakdownRows,
  getAddress,
  logIn
} = require('../utils.js')

describe('Full run through', function() {

  beforeEach(() => {
    cy.fixture('user.json').as('user')
  })

  it('successfully loads the home page', function() {
    cy.visit('/')
    cy.injectAxe() 

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
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/personal/name')
    cy.get('h1').should('contain', 'Confirm your name')

    cy.get('input#nameYes + label').should('have.attr', 'for', 'nameYes')

    cy.get('input#nameYes')
      .click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click() 
  })

  it('navigates the Confirm Residence page', function() {
    //CONFIRM RESIDENCE
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/personal/residence')
    cy.get('h1').should('contain', 'Confirm your province or territory of residence')

    cy.get('form label').should('have.attr', 'for', 'residence')

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click() 
  })

  it('navigates the Confirm Mailing page', function() {
    //CONFIRM MAILING
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/personal/address')
    cy.get('h1').should('contain', 'Confirm your mailing address')

    //format address based on apartment/no apartment
    const addressText = getAddress(this.user.address)

    addressText.map( (text, index) => {
      cy.get('div.address div').eq(index).should('contain', text)
    })

    cy.get('a')
      .contains('Confirm')
      .click() 
  })

  it('navigates the Confirm Income page', function() {
    //CONFIRM INCOME
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/financial/income')
    cy.get('h1').should('contain', 'Confirm your income information')

    //check table data
    checkTableRows(cy, allIncomeRows(this.user))

    cy.get('input#confirmIncomeYes + label').should('have.attr', 'for', 'confirmIncomeYes')

    cy.get('input#confirmIncomeYes')
      .click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click() 
  })

  it('navigates the RRSP Deductions page', function() {
    //DEDUCTIONS RRSP
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/deductions/rrsp')
    cy.get('h1').should('contain', 'Deduct your RRSP contributions')

    cy.get('input#rrspClaimNo + label').should('have.attr', 'for', 'rrspClaimNo')

    cy.get('input#rrspClaimNo')
      .click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click() 
  })

  it('navigates the Confirm Marital Status page', function() {
    //CONFIRM MARITAL STATUS
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/personal/maritalStatus')
    cy.get('h1').should('contain', 'Confirm your marital status')

    cy.get('a[href="/deductions/medical"]')
      .should('contain', 'Confirm')
      .click() 
  })

  it('navigates the Medical Deductions page', function() {
    //DEDUCTIONS MEDICAL
    cy.injectAxe()
    cy.checkA11y()
    cy.url().should('contain', '/deductions/medical')
    cy.get('h1').should('contain', 'Medical expenses')

    cy.get('input#medicalClaimNo + label').should('have.attr', 'for', 'medicalClaimNo')

    cy.get('input#medicalClaimNo')
      .click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click() 
  })

  it('navigates the Political Deductions page', function() {
    //DEDUCTIONS POLITICAL
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/deductions/political')
    cy.get('h1').should('contain', 'Political contributions')

    cy.get('input#politicalClaimNo + label').should('have.attr', 'for', 'politicalClaimNo')

    cy.get('input#politicalClaimNo')
      .click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click() 
  })

  it('navigates the Donations Deductions page', function() {
    //DEDUCTIONS DONATIONS
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/deductions/donations')
    cy.get('h1').should('contain', 'Deduct your charitable donations')

    cy.get('input#donationsClaimNo + label').should('have.attr', 'for', 'donationsClaimNo')

    cy.get('input#donationsClaimNo')
      .click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click() 
  })

  it('navigates the Trillium Rent page', function() {
    //TRILLIUM RENT
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/trillium/rent/amount')
    cy.get('h1').should('contain', 'Enter rent paid in 2018')
    cy.get('form input#trilliumRentAmount')
      .clear()
      .type(this.user.trilliumRentAmount)
      .should('have.value', `${this.user.trilliumRentAmount}`)
    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click() 
  })

  it('navigates the Trillium Property Tax page', function() {
    //TRILLIUM PROPERTY TAX
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/trillium/propertyTax/amount')
    cy.get('h1').should('contain', 'Enter property tax paid in 2018')
    cy.get('form input#trilliumPropertyTaxAmount')
      .clear()
      .type(this.user.trilliumPropertyTaxAmount)
      .should('have.value', `${this.user.trilliumPropertyTaxAmount}`)
    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click() 
  })

  it('navigates the Trillium Student Residence page', function() {
    //TRILLIUM STUDENT RESIDENCE
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/trillium/studentResidence')
    cy.get('h1').should('contain', 'Designated student residence')
    cy.get('input#trilliumStudentResidenceNo + label').should('have.attr', 'for', 'trilliumStudentResidenceNo')

    cy.get('input#trilliumStudentResidenceNo')
      .click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click() 
  })

  it('navigates the Trillium Home Energy page', function() {
    //TRILLIUM HOME ENERGY
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/trillium/energy/amount')
    cy.get('h1').should('contain', 'Home energy costs on a reserve')
    cy.get('form input#trilliumEnergyAmount')
      .clear()
      .type(this.user.trilliumEnergyAmount)
      .should('have.value', `${this.user.trilliumEnergyAmount}`)
    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click() 
  })

  it('navigates the Trillium Long Term Care page', function() {
    //TRILLIUM LONG TERM CARE
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/trillium/longTermCare/amount')
    cy.get('h1').should('contain', 'Public long-term care home costs')
    cy.get('form input#trilliumLongTermCareAmount')
      .clear()
      .type(this.user.trilliumLongTermCareAmount)
      .should('have.value', `${this.user.trilliumLongTermCareAmount}`)
    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click() 
  })

  it('navigates the Climate Action Incentive page', function() {
    //CLIMATE ACTION INCENTIVE
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/deductions/climate-action-incentive')
    cy.get('h1').should('contain', 'Climate Action Incentive')

    cy.get('input#climateActionIncentiveIsRuralNo + label').should('have.attr', 'for', 'climateActionIncentiveIsRuralNo')

    cy.get('input#climateActionIncentiveIsRuralNo')
      .click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Continue')
      .click() 
  })

  it('navigates the Review page', function() {
    //REVIEW
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/review')
    cy.get('h1').should('contain', 'Review and file tax return')

    //check some table data
    //until we have a more firm grasp on how we're shaping the total refund, i'm just checking benefits
    checkTableRows(cy, getBenefitsBreakdownRows(this.user))

    cy.get('input#review + label').should('have.attr', 'for', 'review')

    cy.get('input#review')
      .click()

    cy.get('form button[type="submit"]')
      .should('contain', 'Submit my return')
      .click() 
  })

  it('checks the Confirmation page', function() {
    // CONFIRMATION PAGE
    cy.injectAxe().checkA11y()
    cy.url().should('contain', '/confirmation')
    cy.get('h1').should('contain', 'Congratulations')
    cy.get('h2').should('contain', 'Your taxes have been filed with the Canada Revenue Agency.')
    cy.get('td')
      .should('contain', '5H3P9IO5816')
  })
})