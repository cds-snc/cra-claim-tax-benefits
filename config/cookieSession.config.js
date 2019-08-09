/*
 configuration for our cookie sessions
  - set a name for the session so that the cookie persists between server reloads
    - if a COOKIE_SECRET environment variable, use that as a secret name
    - else use a timestamp that rotates every 60 minutes
  - also set cookie expiry time to 60 minutes
  more docs here: https://expressjs.com/en/resources/middleware/cookie-session.html
*/
const oneHour = 1000 * 60 * 60
const sessionName = `ctb-${process.env.COOKIE_SECRET || Math.floor(new Date().getTime() / oneHour)}`

const cookieSessionConfig = {
  name: sessionName,
  secret: sessionName,
  cookie: {
    httpOnly: true,
    maxAge: oneHour,
    sameSite: true,
  },
}

// If we're running in "production" and the github sha is there, then it's probable that we're on live on prod
if (process.env.NODE_ENV === 'production' && process.env.GITHUB_SHA) {
  cookieSessionConfig.cookie.secure = true
}

module.exports = cookieSessionConfig
