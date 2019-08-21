const { currencyFilter } = require('./../../utils')

const checkTableRows = (cy, rows) => {
  rows.map((row, index) => {
    cy.get('dt.breakdown-table__row-key')
      .eq(index)
      .should('contain', row.key)
      .next('dd')
      .should('contain', row.value)
  })
}

const getIncomeBreakdownRows = (user) => {
  const incomeRows = [];
  
  user.financial.incomeSources.map((source) => {
    const incomeRow = {
      key: source.name,
      value: currencyFilter(source.total)
    }
    incomeRows.push(incomeRow)
  })

  incomeRows.push(
    {
      key: user.financial.incomes.totalIncome.name,
      value: currencyFilter(user.financial.incomes.totalIncome.amount)
    }
  )

  return incomeRows
}

const getTaxBreakdownRows = (user) => {
  const taxRows = [];
  
  Object.values(user.financial.taxes).map((source) => {
    const taxRow = {
      key: `${source.name.replace('Net ', '')} deduction`,
      value: currencyFilter(source.amount)
    }
    taxRows.push(taxRow)
  })
  
  taxRows.push(
    {
      key: 'Total tax paid for 2018',
      value: currencyFilter(user.financial.totalTax)
    }
  )

  return taxRows
}

const getBenefitsBreakdownRows = (user) => {
  const benefitsRows = [];
  
  Object.values(user.benefits).map((source) => {
    const benefitsRow = {
      key: source.name,
      value: currencyFilter(source.amount)
    }
    benefitsRows.push(benefitsRow)
  })

  return benefitsRows
}

const allIncomeRows = (user) => getIncomeBreakdownRows(user).concat(getTaxBreakdownRows(user))

describe('Full run through', function() {
  it('successfully loads the home page', function() {
    cy.visit('/')
    // make sure axe is available on the page
    cy.injectAxe() 

    // START PAGE
    cy.checkA11y()
    cy.get('h1').should('contain', 'Claim Tax Benefits')
    cy.get('main a')
      .should('contain', 'Start now')
      .click()

    // LOGIN CODE PAGE
    cy.injectAxe() 
    cy.checkA11y()
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
      cy.injectAxe() 
      cy.checkA11y()
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
      cy.injectAxe() 
      cy.checkA11y()
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
      cy.injectAxe() 
      cy.checkA11y()
      cy.url().should('contain', '/personal/name')
      cy.get('h1').should('contain', 'Confirm your name')

      cy.get('input#nameYes + label').should('have.attr', 'for', 'nameYes')

      cy.get('input#nameYes')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //CONFIRM RESIDENCE
      cy.injectAxe() 
      cy.checkA11y()
      cy.url().should('contain', '/personal/residence')
      cy.get('h1').should('contain', 'Confirm your province or territory of residence')

      cy.get('form label').should('have.attr', 'for', 'residence')

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //CONFIRM MAILING
      cy.injectAxe() 
      cy.checkA11y()
      cy.url().should('contain', '/personal/address')
      cy.get('h1').should('contain', 'Confirm your mailing address')

      //TODO: add a check for apartment/no apartment
      const addressText = [`${user.personal.address.line2}-${user.personal.address.line1}`, `${user.personal.address.city}, ${user.personal.address.province}`, `${user.personal.address.postalCode}`]

      addressText.map( (text, index) => {
        cy.get('div.address div').eq(index).should('contain', text)
      })

      cy.get('a[href="/financial/income"]')
        .should('contain', 'Confirm')
        .click() 

      //CONFIRM INCOME
      cy.injectAxe() 
      cy.checkA11y()
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
      cy.injectAxe() 
      cy.checkA11y()
      cy.url().should('contain', '/deductions/rrsp')
      cy.get('h1').should('contain', 'Deduct your RRSP contributions')

      cy.get('input#rrspClaimNo + label').should('have.attr', 'for', 'rrspClaimNo')

      cy.get('input#rrspClaimNo')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //CONFIRM MARITAL STATUS
      cy.injectAxe() 
      cy.checkA11y()
      cy.url().should('contain', '/personal/maritalStatus')
      cy.get('h1').should('contain', 'Confirm your marital status')

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
      cy.injectAxe() 
      cy.checkA11y()
      cy.url().should('contain', '/deductions/political')
      cy.get('h1').should('contain', 'Political contributions')

      cy.get('input#politicalClaimNo + label').should('have.attr', 'for', 'politicalClaimNo')

      cy.get('input#politicalClaimNo')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //DEDUCTIONS DONATIONS
      cy.injectAxe() 
      cy.checkA11y()
      cy.url().should('contain', '/deductions/donations')
      cy.get('h1').should('contain', 'Deduct your charitable donations')

      cy.get('input#donationsClaimNo + label').should('have.attr', 'for', 'donationsClaimNo')

      cy.get('input#donationsClaimNo')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 
      
      //TRILLIUM RENT
      cy.injectAxe() 
      cy.checkA11y()
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
      cy.injectAxe() 
      cy.checkA11y()
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
      cy.injectAxe() 
      cy.checkA11y()
      cy.url().should('contain', '/trillium/studentResidence')
      cy.get('h1').should('contain', 'Designated student residence')
      cy.get('input#trilliumStudentResidenceNo + label').should('have.attr', 'for', 'trilliumStudentResidenceNo')
 
      cy.get('input#trilliumStudentResidenceNo')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 
      
      //TRILLIUM HOME ENERGY
      cy.injectAxe() 
      cy.checkA11y()
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
      cy.injectAxe() 
      cy.checkA11y()
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
      cy.injectAxe() 
      cy.checkA11y()
      cy.url().should('contain', '/deductions/climate-action-incentive')
      cy.get('h1').should('contain', 'Climate Action Incentive')

      cy.get('input#climateActionIncentiveIsRuralNo + label').should('have.attr', 'for', 'climateActionIncentiveIsRuralNo')

      cy.get('input#climateActionIncentiveIsRuralNo')
        .click()

      cy.get('form button[type="submit"]')
        .should('contain', 'Continue')
        .click() 

      //REVIEW
      cy.injectAxe() 
      cy.checkA11y()
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
      cy.injectAxe() 
      cy.checkA11y()
      cy.url().should('contain', '/confirmation')
      cy.get('h1').should('contain', 'Congratulations')
      cy.get('h2').should('contain', 'Your taxes have been filed with the Canada Revenue Agency.')
      cy.get('td')
        .should('contain', '5H3P9IO5816')

    })
  })
})