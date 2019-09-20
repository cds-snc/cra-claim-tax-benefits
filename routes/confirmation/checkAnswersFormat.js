const API = require('../../api')
const { answerInfo } = require('./checkAnswers')
const { hasData } = require('./../../utils')

const user = API.getUser('A5G98S4K1')

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
    return hasData(session,data[0],true)
  }
}

const formatAnswerInfo = (session) => {
  const answerInfoFormatted = {};

  answerInfo.map((section) => {
    //displayIf
    answerInfoFormatted[section.sectionName] = section.sectionLines
  
    //map over the sectionlines
    section.sectionLines.map((line, index) => {
  
      answerInfoFormatted[section.sectionName][index]['data'] = formatDataLine(line.infoPath, session)
  
    })
  })

  return answerInfoFormatted
}

console.log(formatAnswerInfo(user))

module.exports = {
  formatAnswerInfo
}