const enJson = require('./en.json')
const frJson = require('./fr.json')

const frKeys = Object.keys(frJson)
const enKeys = Object.keys(enJson)


if(!process.argv[2]) {
  console.log('\u001b[31m','You need to pass a locale argument\n such as EN or FR')
} else  {

  const locale1 = process.argv[2].toUpperCase()
  const locale2 = locale1 === 'EN' ? 'FR' : 'EN'

  const file1 = locale1 === 'EN' ? enKeys : frKeys
  const file2 = file1 === enKeys ? frKeys : enKeys

  const difference = file1.filter(x => !file2.includes(x))

  console.log('\x1b[33m%s\x1b[0m',`⚠ WARNING ⚠\nthe following keys are in the ${locale1} locales file,\nbut missing from the ${locale2} locales file :\n`, difference)
}
