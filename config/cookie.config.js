const oneHour = 1000 * 60 * 60

module.exports = { httpOnly: true, maxAge: oneHour, sameSite: 'strict' }
