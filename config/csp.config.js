/* eslint-disable */
const connectSrc = ["'self'"]

if (process.env.CTBS_SERVICE_URL) {
  connectSrc.push(process.env.CTBS_SERVICE_URL.replace(/\/$/, ''))
}

module.exports = {
  connectSrc,
  defaultSrc: ["'self'"],
  fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com'],
  scriptSrc: ["'self'", 'https://www.google-analytics.com', "'unsafe-inline'"],
  styleSrc: ["'self'", 'https://fonts.googleapis.com'],
}
