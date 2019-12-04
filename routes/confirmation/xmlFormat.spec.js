const API = require('./../../api')
const { outputXML } = require('./xmlFormat')

const initialSession = API.getUser('A5G98S4K1')

const dataToLine = [
  {
    line: 150,
    value: 'financial.incomes.totalIncome.amount',
  },
  {
    //multiple 5880 by 5.05% so 0.0505
    line: 5884,
    value: 'deductions.basicPersonalAmount.amount',
  },
  {
    line: 6110,
    value: 'deductions.trilliumRentAmount',
    addIf: 'deductions.trilliumRentClaim',
  },
  {
    line: 6118,
    value: [
      'deductions.trilliumPropertyTaxAmount',
      'deductions.trilliumLongTermCareClaim',
      'deductions.trilliumEnergyReserveClaim',
    ],
  },
]

describe('Test ouputXML format', () => {
  test('it creates 4 return lines and sets 0 for false', async () => {
    const xmlOut = outputXML({ session: { ...initialSession } }, dataToLine)

    const t1Lines = xmlOut['elements'][0]['elements'][0]['elements'][0]['elements']

    const returnLines = t1Lines.filter(line => line.name === 'comm:ReturnLine')

    const maritalStatus = t1Lines.find(line => line.name === 't1:TaxpayerData').elements[0]
      .elements[3].elements[0].text

    const address = t1Lines.find(line => line.name === 't1:TaxpayerData').elements[2].elements[1]
      .elements[0].elements[0].elements[0].text

    expect(t1Lines.length).toBe(7)
    expect(returnLines.length).toBe(3)
    expect(maritalStatus).toBe(6)
    expect(address).toBe(
      `${initialSession.personal.address.line2}-${initialSession.personal.address.line1}`,
    )
  })

  test('it creates 5 return lines if an addIf is met and 1 for true values', async () => {
    const xmlOut = outputXML(
      {
        session: {
          ...initialSession,
          deductions: {
            trilliumRentClaim: true,
          },
        },
      },
      dataToLine,
    )

    const t1Lines = xmlOut['elements'][0]['elements'][0]['elements'][0]['elements']

    const returnLines = t1Lines.filter(line => line.name === 'comm:ReturnLine')

    expect(t1Lines.length).toBe(8)
    expect(returnLines.length).toBe(4)
  })
})
