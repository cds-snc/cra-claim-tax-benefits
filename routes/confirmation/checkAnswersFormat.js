const { answerInfo } = require('./checkAnswers')
const { hasData } = require('./../../utils')
const { format, parseISO } = require('date-fns')

const formatDataLine = (data, session) => {
  if (data.length > 1) {
    const dataValues = []
    data.map((val) => {
      dataValues.push(hasData(session, val, true))
    })

    if (typeof dataValues[1] === 'number') {
      return dataValues.reduce((a,b) => a + b, 0)
    } else if (typeof dataValues[1] === 'string') {
      return dataValues.join(' ')
    }

  } else {
    if(hasData(session,data[0],true) === null || hasData(session,data[0],true) === false) {
      return 'No'
    } else if (hasData(session,data[0],true) === true) {
      return 'Yes'
    } else if (data[0].includes('Birth')) {
      const initialDate = parseISO(hasData(session,data[0],true))
      return format(new Date(initialDate), 'd MMMM yyyy')
    } else {
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