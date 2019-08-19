// const checkTableRows = (cy, rows) => {
//   rows.map((row, index) => {
//     cy.get('dt.key')
//       .eq(index)
//       .should('contain', row.key)
//       .next('dd')
//       .should('contain', row.value)
//   })
// }

describe('Full run through', function() {
  it('successfully loads the home page', function() {
    cy.visit('/')

    // START PAGE
    cy.get('h1').should('contain', 'Claim Tax Benefits')
    cy.get('main a')
      .should('contain', 'Start now')
      .click()

    // LOGIN CODE PAGE
    cy.url().should('contain', '/login/code')
    cy.get('h1').should('contain', 'Enter your personal access code')

    cy.fixture('user').then(user => {
      cy.get('form label').should('have.attr', 'for', 'code')
      cy.get('form input#code')
        .type(user.login.code)
        .should('have.value', user.login.code)
      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click()

      // LOGIN SIN
      cy.url().should('contain', '/login/sin')
      cy.get('h1').should('contain', 'Enter your Social Insurance Number (SIN)')

      //TODO: find out why this is having an issue
      // cy.get('h2')
      //   .first()
      //   .should('contain', `Thanks, ${user.personal.firstName} ${user.personal.lastName}!`)

      cy.get('form label').should('have.attr', 'for', 'sin')
      cy.get('form input#sin')
        .type(user.personal.sin)
        .should('have.value', user.personal.sin)
      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click()

      // LOGIN DOB
      cy.url().should('contain', '/login/dateOfBirth')
      cy.get('h1').should('contain', 'Enter your date of birth')

      cy.get('form label').should('have.attr', 'for', 'dateOfBirth')
      cy.get('form input#dateOfBirth')
        .type(user.personal.dateOfBirth)
        .should('have.value', user.personal.dateOfBirth)
      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click()

      //CONFIRM NAME
      cy.url().should('contain', '/personal/name')
      cy.get('h1').should('contain', 'Confirm your name')

      cy.get('input#nameYes + label').should('have.attr', 'for', 'nameYes')

      cy.get('input#nameYes')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //CONFIRM RESIDENCE
      cy.url().should('contain', '/personal/residence')
      cy.get('h1').should('contain', 'Confirm your province or territory of residence')

      cy.get('form label').should('have.attr', 'for', 'residence')

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //CONFIRM MAILING
      cy.url().should('contain', '/personal/address')
      cy.get('h1').should('contain', 'Confirm your mailing address')

      //TODO: check mail address

      cy.get('a[href="/financial/income"]')
        .should('contain', 'Confirm')
        .click() 

      //CONFIRM INCOME
      cy.url().should('contain', '/financial/income')
      cy.get('h1').should('contain', 'Confirm your income information')

      //TODO: check table data

      cy.get('input#confirmIncomeYes + label').should('have.attr', 'for', 'confirmIncomeYes')

      cy.get('input#confirmIncomeYes')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //DEDUCTIONS RRSP
      cy.url().should('contain', '/deductions/rrsp')
      cy.get('h1').should('contain', 'Deduct your RRSP contributions')

      cy.get('input#rrspClaimNo + label').should('have.attr', 'for', 'rrspClaimNo')

      cy.get('input#rrspClaimNo')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //CONFIRM MARITAL STATUS
      cy.url().should('contain', '/personal/maritalStatus')
      cy.get('h1').should('contain', 'Confirm your marital status')

      cy.get('a[href="/deductions/medical"]')
        .should('contain', 'Confirm')
        .click() 

       //DEDUCTIONS MEDICAL
       cy.url().should('contain', '/deductions/medical')
       cy.get('h1').should('contain', 'Medical expenses')
 
       cy.get('input#medicalClaimNo + label').should('have.attr', 'for', 'medicalClaimNo')
 
       cy.get('input#medicalClaimNo')
         .click()
 
       cy.get('form button[type="submit"]')
         .should('contain', 'Continue')
         .click() 

      //DEDUCTIONS POLITICAL
       cy.url().should('contain', '/deductions/political')
       cy.get('h1').should('contain', 'Political contributions')
 
       cy.get('input#politicalClaimNo + label').should('have.attr', 'for', 'politicalClaimNo')
 
       cy.get('input#politicalClaimNo')
         .click()
 
       cy.get('form button[type="submit"]')
         .should('contain', 'Continue')
         .click() 

      //DEDUCTIONS DONATIONS
       cy.url().should('contain', '/deductions/donations')
       cy.get('h1').should('contain', 'Deduct your charitable donations')
 
       cy.get('input#donationsClaimNo + label').should('have.attr', 'for', 'donationsClaimNo')
 
       cy.get('input#donationsClaimNo')
         .click()
 
       cy.get('form button[type="submit"]')
         .should('contain', 'Continue')
         .click() 
      
      //TRILLIUM RENT
      cy.url().should('contain', '/trillium/rent/amount')
      cy.get('h1').should('contain', 'Enter rent paid in 2018')
      cy.get('form input#trilliumRentAmount')
        .clear()
        .type(user.deductions.trilliumRentAmount)
        .should('have.value', `${user.deductions.trilliumRentAmount}`)
      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //TRILLIUM PROPERTY TAX
      cy.url().should('contain', '/trillium/propertyTax/amount')
      cy.get('h1').should('contain', 'Enter property tax paid in 2018')
      cy.get('form input#trilliumPropertyTaxAmount')
        .clear()
        .type(user.deductions.trilliumPropertyTaxAmount)
        .should('have.value', `${user.deductions.trilliumPropertyTaxAmount}`)
      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //TRILLIUM STUDENT RESIDENCE
      cy.url().should('contain', '/trillium/studentResidence')
      cy.get('h1').should('contain', 'Designated student residence')
      cy.get('input#trilliumStudentResidenceNo + label').should('have.attr', 'for', 'trilliumStudentResidenceNo')
 
      cy.get('input#trilliumStudentResidenceNo')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 
      
      //TRILLIUM HOME ENERGY
      cy.url().should('contain', '/trillium/energy/amount')
      cy.get('h1').should('contain', 'Home energy costs on a reserve')
      cy.get('form input#trilliumEnergyAmount')
        .clear()
        .type(user.deductions.trilliumEnergyAmount)
        .should('have.value', `${user.deductions.trilliumEnergyAmount}`)
      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //TRILLIUM LONG TERM CARE
      cy.url().should('contain', '/trillium/longTermCare/amount')
      cy.get('h1').should('contain', 'Public long-term care home costs')
      cy.get('form input#trilliumLongTermCareAmount')
        .clear()
        .type(user.deductions.trilliumLongTermCareAmount)
        .should('have.value', `${user.deductions.trilliumLongTermCareAmount}`)
      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //DEDUCTIONS DONATIONS
      cy.url().should('contain', '/deductions/climate-action-incentive')
      cy.get('h1').should('contain', 'Climate Action Incentive')

      cy.get('input#climateActionIncentiveIsRuralNo + label').should('have.attr', 'for', 'climateActionIncentiveIsRuralNo')

      cy.get('input#climateActionIncentiveIsRuralNo')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //REVIEW
      cy.url().should('contain', '/review')
      cy.get('h1').should('contain', 'Review and file tax return')

      //TODO: check table data

      cy.get('input#review + label').should('have.attr', 'for', 'review')

      cy.get('input#review')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Submit my return')
        .click() 

      // CONFIRMATION PAGE
      cy.url().should('contain', '/confirmation')
      cy.get('h1').should('contain', 'Congratulations')
      cy.get('h2').should('contain', 'Your taxes have been filed with the Canada Revenue Agency.')
      cy.get('td')
        .should('contain', '5H3P9IO5816')

    })
  })
})