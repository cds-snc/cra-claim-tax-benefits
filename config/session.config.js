const session = require('express-session')
const MemoryStore = require('memorystore')(session)

const oneHour = 1000 * 60 * 60
const sessionName = `ctb-${process.env.SESSION_SECRET ||
  Math.floor(new Date().getTime() / oneHour)}`

// default setup: https://github.com/roccomuso/memorystore#setup
module.exports = session({
  cookie: { maxAge: oneHour },
  store: new MemoryStore({
    checkPeriod: oneHour, // prune expired entries every hour
  }),
  secret: sessionName,
})
