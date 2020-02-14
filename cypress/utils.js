const checkTableRows = (cy, rows, tableRowClass) => {
  rows.map((row, index) => {
    cy.get(tableRowClass)
      .eq(index)
      .should('contain', row.key)
      .next('dd')
      .should('contain', row.value)
  })
}

const getBenefitsBreakdownRows = user => {
  const benefitsKeys = Object.values(user.benefits)
  const benefitsRows = benefitsKeys.map(source => {
    return {
      key: source.name,
      value: source.description,
    }
  })

  return benefitsRows
}

const getAddress = address => {
  const fullAddress = [`${address.city}, ${address.province}`, `${address.postalCode}`]
  if (address.line2.en && address.line2.en !== '') {
    fullAddress.unshift(`${address.line2.en}-${address.line1.en}`)
  } else {
    fullAddress.unshift(`${address.line1.en}`)
  }

  return fullAddress
}

module.exports = {
  checkTableRows,
  getBenefitsBreakdownRows,
  getAddress,
}
