/* eslint-disable */
const connectSrc = ["'self'"]

if (process.env.CTBS_SERVICE_URL) {
  connectSrc.push(process.env.CTBS_SERVICE_URL.replace(/\/$/, ''))
}

// docs: https://helmetjs.github.io/docs/csp/
module.exports = {
  defaultSrc: ["'self'"],
  connectSrc,
  baseUri: ["'none'"],
  fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  imgSrc: ["'self'", 'data:'],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'", 'https://fonts.googleapis.com'],
}
