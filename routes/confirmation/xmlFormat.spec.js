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
  test('it creates 4 return lines and sets 0 for false', async () => {
    const xmlOut = outputXML({session: {...initialSession}}, false, dataToLine)

    const t1Lines = xmlOut['elements'][0]['elements'][0]['elements'][0]['elements']

    const returnLines = t1Lines.filter(line => line.name === 'comm:ReturnLine')

    const studentResidence = returnLines.filter( line => line.elements[0].elements[0].text === 6114)[0].elements[1].elements[0].text

    expect(t1Lines.length).toBe(8)
    expect(returnLines.length).toBe(4)
    expect(studentResidence).toBe(0)
  })

  test('it creates 5 return lines if an addIf is met and 1 for true values', async () => {
    const xmlOut = outputXML({session: {
      ...initialSession,
      deductions: { 
        trilliumRentClaim: true,
        trilliumStudentResidence: true,
      }
    }}, false, dataToLine)

    const t1Lines = xmlOut['elements'][0]['elements'][0]['elements'][0]['elements']

    const returnLines = t1Lines.filter(line => line.name === 'comm:ReturnLine')

    const studentResidence = returnLines.filter( line => line.elements[0].elements[0].text === 6114)[0].elements[1].elements[0].text

    expect(t1Lines.length).toBe(9)
    expect(returnLines.length).toBe(5)
    expect(studentResidence).toBe(1)
  })
})