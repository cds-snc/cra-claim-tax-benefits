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
    line: 6114,
    value: 'deductions.trilliumStudentResidence',
  },
  { 
    line: 6118,
    value: [ 
      'deductions.trilliumPropertyTaxAmount',
      'deductions.trilliumStudentResidence',
      'deductions.trilliumLongTermCareClaim',
      'deductions.trilliumEnergyReserveClaim',
    ],
  },
]

describe('Test ouputXML format', () => { 
  test('it creates 4 return lines', async () => {
    const xmlOut = outputXML({session: {...initialSession}}, dataToLine, true)

    const returnLines = xmlOut['elements'][0]['elements'][0]['elements'][0]['elements'].filter(line => line.name === 'comm:ReturnLine')

    expect(returnLines.length).toBe(4)
  })

  test('it creates 5 return lines if an addIf is met', async () => {
    const xmlOutt = outputXML({session: {
      ...initialSession,
      deductions: { trilliumRentClaim: true }
    }}, dataToLine, true)

    const returnLiness = xmlOutt['elements'][0]['elements'][0]['elements'][0]['elements'].filter(line => line.name === 'comm:ReturnLine')

    expect(returnLiness.length).toBe(5)
  })
})