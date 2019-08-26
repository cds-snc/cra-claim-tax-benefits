const { 
  checkTableRows,
  allIncomeRows,
  getBenefitsBreakdownRows,
  getAddress,
  logIn
} = require('../utils.js')

describe('Full run through', function() {
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
  it('logins and runs through the flow', function() {
    cy.fixture('user_edits').then(user => {
      logIn(cy, user)

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

      //CONFIRM RESIDENCE
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/personal/residence')
      cy.get('h1').should('contain', 'Confirm your province or territory of residence')

      cy.get('form label').should('have.attr', 'for', 'residence')

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //CONFIRM MAILING
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/personal/address')
      cy.get('h1').should('contain', 'Confirm your mailing address')

      //format address based on apartment/no apartment
      const addressText = getAddress(user.address)

      addressText.map( (text, index) => {
        cy.get('div.address div').eq(index).should('contain', text)
      })

      cy.get('a')
        .contains('Change your mailing address')
        .click()

      //AUTH PAGE
      cy.injectAxe().checkA11y()
      cy.get('input#auth')
        .clear()
        .type(10)

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 
      
      //EDIT MAILING
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/personal/address/edit')
      cy.get('input#line1')
        .clear()
        .type(user.addressNew.line1)
      
      cy.get('input#line2')
        .clear()

      cy.get('input#postalCode')
        .clear()
        .type(user.addressNew.postalCode)

      cy.get('form button[type="submit"]')
        .should('contain', 'Change mailing address')
        .click() 

      //CONFIRM MAILING AGAIN
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/personal/address')

      //format address based on apartment/no apartment
      const newAddressText = getAddress(user.addressNew)

      newAddressText.map( (text, index) => {
        cy.get('div.address div').eq(index).should('contain', text)
      })

      cy.get('a')
        .contains('Confirm')
        .click()

      //CONFIRM INCOME
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/financial/income')
      cy.get('h1').should('contain', 'Confirm your income information')

      //check table data
      checkTableRows(cy, allIncomeRows(user))

      cy.get('input#confirmIncomeYes + label').should('have.attr', 'for', 'confirmIncomeYes')

      cy.get('input#confirmIncomeYes')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

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

      //CONFIRM MARITAL STATUS
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/personal/maritalStatus')
      cy.get('h1').should('contain', 'Confirm your marital status') 

      cy.get('.pure-table div')
        .should('contain', 'Single')

      cy.get('a')
        .contains('Change your marital status')
        .click()

      //EDIT MARITAL STATUS
      cy.injectAxe().checkA11y()
      cy.get('input#maritalStatusMarried + label')
        .should('have.attr', 'for', 'maritalStatusMarried')
        .click()
      
      cy.get('form button[type="submit"]')
        .should('contain', 'Change Marital Status')
        .click() 

      //CONFIRM MARITAL STATUS AGAIN
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/personal/maritalStatus')

      cy.get('.pure-table div')
        .should('contain', 'Married')

      cy.get('a[href="/deductions/medical"]')
        .should('contain', 'Confirm')
        .click() 

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
      
      //TRILLIUM RENT
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/trillium/rent/amount')
      cy.get('h1').should('contain', 'Enter rent paid in 2018')
      cy.get('form input#trilliumRentAmount')
        .clear()
        .type(user.trilliumRentAmount)
        .should('have.value', `${user.trilliumRentAmount}`)
      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //TRILLIUM PROPERTY TAX
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/trillium/propertyTax/amount')
      cy.get('h1').should('contain', 'Enter property tax paid in 2018')
      cy.get('form input#trilliumPropertyTaxAmount')
        .clear()
        .type(user.trilliumPropertyTaxAmount)
        .should('have.value', `${user.trilliumPropertyTaxAmount}`)
      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

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
      
      //TRILLIUM HOME ENERGY
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/trillium/energy/amount')
      cy.get('h1').should('contain', 'Home energy costs on a reserve')
      cy.get('form input#trilliumEnergyAmount')
        .clear()
        .type(user.trilliumEnergyAmount)
        .should('have.value', `${user.trilliumEnergyAmount}`)
      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //TRILLIUM LONG TERM CARE
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/trillium/longTermCare/amount')
      cy.get('h1').should('contain', 'Public long-term care home costs')
      cy.get('form input#trilliumLongTermCareAmount')
        .clear()
        .type(user.trilliumLongTermCareAmount)
        .should('have.value', `${user.trilliumLongTermCareAmount}`)
      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //DEDUCTIONS DONATIONS
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/deductions/climate-action-incentive')
      cy.get('h1').should('contain', 'Climate Action Incentive')

      cy.get('input#climateActionIncentiveIsRuralNo + label').should('have.attr', 'for', 'climateActionIncentiveIsRuralNo')

      cy.get('input#climateActionIncentiveIsRuralNo')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //REVIEW
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/review')
      cy.get('h1').should('contain', 'Review and file tax return')

      //check some table data
      //until we have a more firm grasp on how we're shaping the total refund, i'm just checking benefits
      checkTableRows(cy, getBenefitsBreakdownRows(user))

      cy.get('input#review + label').should('have.attr', 'for', 'review')

      cy.get('input#review')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Submit my return')
        .click() 

      // CONFIRMATION PAGE
      cy.injectAxe().checkA11y()
      cy.url().should('contain', '/confirmation')
      cy.get('h1').should('contain', 'Congratulations')
      cy.get('h2').should('contain', 'Your taxes have been filed with the Canada Revenue Agency.')
      cy.get('td')
        .should('contain', '5H3P9IO5816')

    })
  })
})