const enJson = require('./en.json')
const frJson = require('./fr.json')

const frKeys = Object.keys(frJson)
const enKeys = Object.keys(enJson)

const excludeFromTranslation = [
  'Barrie',
  'Belleville',
  'Brantford',
  'Guelph',
  'Hamilton',
  'Kingston',
  'Kitchener-Cambridge-Waterloo',
  'London',
  'Oshawa',
  'Peterborough',
  'St. Catharines-Niagara',
  'Thunder Bay',
  'Windsor',
  'Alberta',
  'Manitoba',
  'Nunavut',
  'Ontario',
  'Saskatchewan',
  'Yukon',
]


if(!process.argv[2]) {
  return console.log('\u001b[31m','You need to pass a locale argument\n such as EN or FR, or missing-translations\n depending on what you are looking to do')
} 

switch(process.argv[2].toUpperCase()) {
  case 'EN':
  case 'FR': {
    const locale1 = process.argv[2].toUpperCase()
    const locale2 = locale1 === 'EN' ? 'FR' : 'EN'

    const file1 = locale1 === 'EN' ? enKeys : frKeys
    const file2 = file1 === enKeys ? frKeys : enKeys

    const difference = file1.filter(x => !file2.includes(x))

    console.log('\x1b[33m%s\x1b[0m',`⚠ WARNING ⚠\nthe following keys are in the ${locale1} locales file,\nbut missing from the ${locale2} locales file :\n`, difference)

    break
  }
  case 'MISSING-TRANSLATIONS': {
    const notTranslated = Object.entries(frJson).map((key) => {
      if(
        key[0] === key[1] ||
        frJson[key[0]] === enJson [key[0]]
      ) {
        return key[1]
      }
    }).filter(Boolean).filter(line => !excludeFromTranslation.includes(line))
  
    console.log('It seems the following lines in the FR locales file are missing translations:\n Please double-check these line are in use\n before requesting translations', notTranslated)

    break
  }
}


