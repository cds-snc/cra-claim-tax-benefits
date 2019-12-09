const checkTableRows = (cy, rows, tableRowClass) => {
  rows.map((row, index) => {
    cy.get(tableRowClass)
      .eq(index)
      .should('contain', row.key)
      .next('dd')
      .should('contain', row.value)
  })
}

const getIncomeBreakdownRows = user => {
  const incomeRows = []

  user.financial.incomeSources.map(source => {
    const incomeRow = {
      key: source.name,
      value: `$${source.total.toLocaleString('en-US')}`,
    }
    incomeRows.push(incomeRow)
    return
  })

  incomeRows.push({
    key: 'Total Income',
    value: `$${user.financial.incomes.totalIncome.amount.toLocaleString('en-US')}`,
  })

  return incomeRows
}

const getBenefitsBreakdownRowsLite = user => {
  const benefitsLiteKeys = Object.values(user.benefitsLite)
  const benefitsLiteRows = benefitsLiteKeys.map(source => {
    return {
      key: source.name,
      value: source.description,
    }
  })

  return benefitsLiteRows
}

const allIncomeRows = user => getIncomeBreakdownRows(user)

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
  allIncomeRows,
  getBenefitsBreakdownRowsLite,
  getAddress,
}
