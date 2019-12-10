const { answerInfo } = require('./checkAnswers')
const { hasData, currencyFilter } = require('./../../utils')
const { format, parseISO } = require('date-fns')
const { fr, enCA } = require('date-fns/locale')
const { routes } = require('./../../config/routes.config')


const addValues = (data, req) => {
  const { session, locale } = req
  const dataValues = []

  data.map(val => {
    dataValues.push(hasData(session, val, true))
  })

  if (data.every(item => item.includes('Amount'))) {
    const addedAmount = dataValues.reduce((a, b) => Number(a) + Number(b), 0)
    return `${currencyFilter(addedAmount, locale)}`
  } else if (data.every(item => typeof item === 'string')) {
    return dataValues.join(' ')
  } else {
    throw new Error(
      'Looks like you are trying to combine numbers and strings  \n Are your infoPaths correct in checkAnswers?',
    )
  }
}

const formatDataLine = (data, req) => {
  const { session, locale } = req

  if (data.length > 1) {
    return addValues(data, req)
  } else {
    switch (true) {
      case hasData(session, data[0], true) === null:
      case hasData(session, data[0], true) === false:
        return 'No'
      case hasData(session, data[0], true) === true:
        return 'Yes'
      case data[0].includes('Birth'): {
        const dateLocale = (!locale || locale === 'en') ? enCA : fr
        const initialDate = parseISO(hasData(session, data[0], true))

        return format(new Date(initialDate), 'd MMMM yyyy', {
          locale: dateLocale,
        })
      }
      case data[0].includes('Amount'): {
        const amount = hasData(session, data[0], true)
        return `${currencyFilter(amount, locale)}`
      }
      default:
        return hasData(session, data[0], true)
    }
  }
}

const formatAnswerInfo = req => {
  const { session } = req
  const answerInfoFormatted = {}

  answerInfo.map(section => {
    answerInfoFormatted[section.sectionTitle] = []

    section.sectionRows.map(line => {
      if (
        !Object.prototype.hasOwnProperty.call(line, 'displayIf') ||
        (Object.prototype.hasOwnProperty.call(line, 'displayIf') &&
          hasData(session, line.displayIf) &&
          hasData(session, line.displayIf, true) !== false &&
          hasData(session, line.displayIf, true) !== 'No')
      ) {
        if (
          Object.prototype.hasOwnProperty.call(line, 'urlPath') &&
          !routes.find(route => route.path === line.urlPath)
        ) {
          throw new Error(
            `Looks like a urlPath in checkAnswers does not exist in routes.config  \n The url is ${line.urlPath} \n Are your route paths correct in checkAnswers?`,
          )
        }

        answerInfoFormatted[section.sectionTitle].push({
          ...line,
          data: formatDataLine(line.infoPath, req),
        })
      }
    })
  })

  return answerInfoFormatted
}

module.exports = {
  formatAnswerInfo,
}
