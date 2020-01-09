const crypto = require('crypto');

const config = {
  iterations: 100000,
  hashBytes: 32,
  digest: 'sha512'
}

const hashArgs = [config.iterations, config.hashBytes, config.digest]

const hashString = (stringToHash) => {
  if (!stringToHash) {
    return Promise.reject('you need to enter a string to hash');
  }
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(stringToHash, salt, ...hashArgs).toString('hex')
  return [salt, hash].join('$')
}

const verifyHash = (stringToHash, original) => {
  const originalHash = original.split('$')[1]
  const salt = original.split('$')[0]
  const hash = crypto.pbkdf2Sync(stringToHash, salt, ...hashArgs).toString('hex')

  return hash === originalHash
}

module.exports = {
  hashString,
  verifyHash,
}
