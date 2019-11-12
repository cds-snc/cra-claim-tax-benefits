const { templateXml } = require('./../../xml_output/template-xml')
const { hasData } = require('./../../utils')
const convert = require('xml-js')
const fs = require('fs')

const dataToLine = [
  { 
    line: 150,
    value: 'financial.incomes.totalIncome.amount',
  },
  { 
    line: 236,
    value: 'financial.incomes.netIncome.amount',
  },
  { 
    line: 260,
    value: 'financial.incomes.taxableIncome.amount',
  },
  { 
    line: 300,
    value: 'deductions.basicPersonalAmount.amount',
  },
  { 
    line: 420,
    value: 'financial.taxes.federal.amount',
  },
  { 
    line: 428,
    value: 'financial.taxes.provincial.amount',
  },
  { 
    line: 435,
    value: 'refund.totalPayable.amount',
  },
  { 
    line: 437,
    value: 'refund.totalDeducted.amount',
  },
  { 
    line: 484,
    value: 'refund.totalRefund.amount',
  },
  { 
    line: 5804,
    value: 'deductions.basicPersonalAmount.amount',
  },
  { 
    line: 5880,
    value: 'deductions.basicPersonalAmount.amount',
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
    line: 6112,
    value: 'deductions.trilliumPropertyTaxAmount',
    addIf: 'deductions.trilliumPropertyTaxClaim',
  },
  { 
    line: 6114,
    value: 'deductions.trilliumStudentResidence',
  },
  { 
    //if any of these are true (1), or false(0)
    line: 6118,
    value: [ 
      'deductions.trilliumPropertyTaxAmount',
      'deductions.trilliumStudentResidence',
      'deductions.trilliumLongTermCareClaim',
      'deductions.trilliumEnergyReserveClaim',
    ],
  },
  { 
    line: 6121,
    value: 'deductions.trilliumEnergyAmount',
    addIf: 'deductions.trilliumEnergyCostClaim',
  },
  { 
    line: 6123,
    addIf: 'deductions.trilliumLongTermCareClaim',
    value: 'deductions.trilliumLongTermCareAmount',
  },
]

const lineShouldBeAdded = (line, session) => {
  return !Object.prototype.hasOwnProperty.call(line, 'addIf') || (Object.prototype.hasOwnProperty.call(line, 'addIf') && hasData(session, line.addIf))
}

const outputXML = (req, createFile = false, linesToAdd = dataToLine) => {
  // force a deep copy to keep it clean between runs
  const newXml = JSON.parse(JSON.stringify(templateXml))

  const linesForEdit = newXml['elements'][0]['elements'][0]['elements'][0]['elements']
  
  linesForEdit.push(addTaxPayerInfo(req.session.personal, req.locale))

  linesToAdd.map((originalLine) => {
    let line = Object.assign({}, originalLine)
    let newLine = {}

    /**
     * some initial thoughts: right now i have a case by line
     * but this can be unruly. I think in the future, we'll probably want in the dataToLine some sort of options, that will specify this value is meant to be multiplied, or check these values for a single true, etc
     * but without an exact idea of how we should format this, i'll leave it as is for now and we'll revisit
     */
    switch(true) {
      case line.line === 5884: {
        const initialValue = hasData(req.session, line.value, true)

        const multipliedValue =  Math.round(initialValue * 0.0505)

        newLine = createReturnLine(line.line, multipliedValue)

        return linesForEdit.push(newLine)
      }
      case line.line === 6118: {

        const fieldValue = ifAnyTrue(line, req.session)

        newLine = createReturnLine(line.line, fieldValue)

        return linesForEdit.push(newLine) 
      }
      case line.value.toLowerCase().includes('amount'): {
        /**
         * another note: we may not always want to round
         * it seems that sometimes they just round, and other times they just remove a decimal
         * so $20.48 will be passed as 2048
         * and then probably somewhere on there system they just know that the last 2 digits fall after a decimal
         * but again, without exact knowledge of the formatting we need, and since it's MOSTLY rounded, we round for our simple base purposes
         */

        if (lineShouldBeAdded(line, req.session)) {

          const initialValue = hasData(req.session, line.value, true)

          const roundedValue = Math.round(initialValue)

          newLine = createReturnLine(line.line, roundedValue)
          
          return linesForEdit.push(newLine) 
        }

        break

      }
      default:
        if (lineShouldBeAdded(line, req.session)) {
          const returnValue = hasData(req.session, line.value, true) === true ? 1 :0

          newLine = createReturnLine(line.line, returnValue)

          return linesForEdit.push(newLine)
        }

        break
    }
  })
  

  const data = convert.json2xml(newXml , {spaces: 2})

  // this because I don't want an output everytime we run the spec files
  if(createFile) {
    /**
     * we can add a dynamic name later if we want
     * I just wanted to avoid a bunch of outputs running cypress tests, for example
     */
    fs.writeFileSync('xml_output/taxfile-2018.xml', data, (err) => {
      if (err) throw err
    })
  }

  // we return the object, mostly for testing purposes
  return newXml
}

const createReturnLine = (lineNumber, fieldValue) => {

  const returnLine = {
    'type': 'element',
    'name': 'comm:ReturnLine',
    'elements': [
      {
        'type': 'element',
        'name': 'comm:FieldCode',
        'elements': [
          {
            'type': 'text',
            'text': lineNumber,
          },
        ],
      },
      {
        'type': 'element',
        'name': 'comm:FieldValue',
        'elements': [
          {
            'type': 'text',
            'text': fieldValue,
          },
        ],
      },
    ],
  }

  return returnLine
}

const ifAnyTrue = (line, session) => {
  const allValues = []

  line.value.map((value) => {
    const finalValue = hasData(session, value, true)
    return allValues.push(finalValue)
  })

  return allValues.includes(true) ? 1 : 0
}

const addTaxPayerInfo = (user, locale) => {
  const maritalStatusCode = (maritalStatus) => {
    switch(maritalStatus.toLowerCase()) {
      case 'married':
        return 1
      case 'common-law':
        return 2
      case 'widowed':
        return 3
      case 'divorced':
        return 4
      case 'separated':
        return 5
      default:
        return 6
    }
  }

  const provincialCode = (province) => {
    const provinces ={
      'Alberta': 'AB',
      'British Columbia': 'BC',
      'Manitoba': 'MB',
      'New Brunswick': 'NB',
      'Newfoundland And Labrador': 'NL',
      'Northwest Territories': 'NT',
      'Nova Scotia': 'NS',
      'Nunavut': 'NU',
      'Ontario': 'ON',
      'Prince Edward Island': 'PE',
      'Quebec': 'QC',
      'Saskatchewan': 'SK',
      'Yukon': 'YT',
    }

    return provinces[province]
  }

  const getFirstAddressLine = (address) => {
    if (address.line2 !== '') {
      return `${address.line2}-${address.line1}`
    }

    return address.line1
  }

  const getCorrespondenceCode = (locale) => {
    // seems to be 1 for English, 2 for French
    const langCode = (!locale || locale === 'en') ? 1 : 2

    return langCode
  }

  const taxPayerInfo = {
    'type': 'element',
    'name': 't1:TaxpayerData',
    'elements': [
      {
        'type': 'element',
        'name': 'tp:TaxpayerBasicData',
        'elements': [
          {
            'type': 'element',
            'name': 'tp:TaxpayerSocialInsuranceNumber',
            'elements': [
              {
                'type': 'text',
                'text': user.sin,
              },
            ],
          },
          {
            'type': 'element',
            'name': 'tp:TaxYear',
            'elements': [
              {
                'type': 'text',
                'text': '2018',
              },
            ],
          },
          {
            'type': 'element',
            'name': 'tp:TaxpayerBirthDate',
            'elements': [
              {
                'type': 'text',
                'text': user.dateOfBirth,
              },
            ],
          },
          {
            'type': 'element',
            'name': 'tp:TaxpayerMaritalStatusCode',
            'elements': [
              {
                'type': 'text',
                'text': maritalStatusCode(user.maritalStatus),
              },
            ],
          },
        ],
      },
      {
        'type': 'element',
        'name': 'tp:TaxpayerResidenceData',
        'elements': [
          {
            'type': 'element',
            'name': 'tp:TaxpayerYearEndResidenceProvinceCode',
            'elements': [
              {
                'type': 'text',
                'text': provincialCode(user.address.province),
              },
            ],
          },
        ],
      },
      {
        'type': 'element',
        'name': 'tp:TaxpayerContactData',
        'elements': [
          {
            'type': 'element',
            'name': 'comm:TaxpayerName',
            'elements': [
              {
                'type': 'element',
                'name': 'comm:GivenName',
                'elements': [
                  {
                    'type': 'text',
                    'text': user.firstName,
                  },
                ],
              },
              {
                'type': 'element',
                'name': 'comm:FamilyName',
                'elements': [
                  {
                    'type': 'text',
                    'text': user.lastName,
                  },
                ],
              },
            ],
          },
          {
            'type': 'element',
            'name': 'tp:TaxpayerMailingAddress',
            'elements': [
              {
                'type': 'element',
                'name': 'comm:CanadianMailingAddress',
                'elements': [
                  {
                    'type': 'element',
                    'name': 'comm:AddressStreetText',
                    'elements': [
                      {
                        'type': 'text',
                        'text': getFirstAddressLine(user.address),
                      },
                    ],
                  },
                  {
                    'type': 'element',
                    'name': 'comm:AddressMunicipalityName',
                    'elements': [
                      {
                        'type': 'text',
                        'text': user.address.city,
                      },
                    ],
                  },
                  {
                    'type': 'element',
                    'name': 'comm:AddressProvinceCode',
                    'elements': [
                      {
                        'type': 'text',
                        'text': provincialCode(user.address.province),
                      },
                    ],
                  },
                  {
                    'type': 'element',
                    'name': 'comm:AddressPostalCode',
                    'elements': [
                      {
                        'type': 'text',
                        'text': user.address.postalCode.replace(' ', ''),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            'type': 'element',
            'name': 'tp:CorrespondenceLanguageCode',
            'elements': [
              {
                'type': 'text',
                'text': getCorrespondenceCode(locale),
              },
            ],
          },
        ],
      },
    ],
  }

  return taxPayerInfo
}

module.exports = {
  outputXML,
}

