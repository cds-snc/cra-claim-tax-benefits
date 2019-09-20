const { answerInfo } = require('./checkAnswers')
const { hasData, dateFilter } = require('./../../utils')

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
    return (hasData(session,data[0],true) === null)
      ? 'No'
      : (hasData(session,data[0],true) === true)
        ? 'Yes'
        : (data[0].includes('Birth'))
          ? dateFilter(hasData(session,data[0],true))
          : hasData(session,data[0],true)
  }
}

const formatAnswerInfo = (session) => {
  const answerInfoFormatted = {}

  answerInfo.map((section) => {

    answerInfoFormatted[section.sectionName] = []

    section.sectionLines.map((line) => {

      if(
        !Object.prototype.hasOwnProperty.call(line, 'displayIf') ||
        Object.prototype.hasOwnProperty.call(line, 'displayIf') &&
        hasData(session, line.displayIf)
      ){
        answerInfoFormatted[section.sectionName].push({
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