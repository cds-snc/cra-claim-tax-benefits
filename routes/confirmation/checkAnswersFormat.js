const { answerInfo } = require('./checkAnswers')
const { hasData, currencyFilter } = require('./../../utils')
const { format, parseISO } = require('date-fns')
const { routes } = require('./../../config/routes.config')

const addValues = (data, session) => {
  const dataValues = []

  data.map((val) => {
    dataValues.push(hasData(session, val, true))
  })

  if (data.every( item => item.includes('Amount'))) {
    return `$${currencyFilter(dataValues.reduce((a,b) => Number(a) + Number(b), 0))}`
  } else if (data.every( item => typeof item === 'string')) {
    return dataValues.join(' ')
  } else {
    throw new Error('Looks like you\'re trying to combine numebrs and strings  \n Are your infoPaths correct checkAnswers?')
  }

}

const formatDataLine = (data, session) => {
  if (data.length > 1) {
    return addValues(data, session)
  } else {
    switch (true) {
      case hasData(session,data[0],true) === null:
      case hasData(session,data[0],true) === false:
        return 'No'
      case hasData(session,data[0],true) === true:
        return 'Yes'
      case data[0].includes('Birth'):{
        const initialDate = parseISO(hasData(session,data[0],true))
        return format(new Date(initialDate), 'd MMMM yyyy')
      }
      case data[0].includes('Amount'):
        return `$${currencyFilter(hasData(session, data[0], true))}`
      default:
        return hasData(session,data[0],true)
    }
  }
}

const formatAnswerInfo = (session) => {
  const answerInfoFormatted = {}

  answerInfo.map((section) => {

    answerInfoFormatted[section.sectionTitle] = []

    section.sectionRows.map((line) => {

      if(
        !Object.prototype.hasOwnProperty.call(line, 'displayIf') ||
        Object.prototype.hasOwnProperty.call(line, 'displayIf') &&
        hasData(session, line.displayIf) && hasData(session, line.displayIf, true) !== false
      ){

        if (Object.prototype.hasOwnProperty.call(line, 'urlPath') && !routes.find(route => route.path === line.urlPath)) {
          throw new Error('Looks like a urlPath in checkAnswers does not exist in routes.config  \n Are your route paths correct in checkAnswers?')
        }

        answerInfoFormatted[section.sectionTitle].push({
          ...line,
          data: formatDataLine(line.infoPath, session),
        })
      }
    })
  })

  return answerInfoFormatted
}

module.exports = {
  formatAnswerInfo,
}