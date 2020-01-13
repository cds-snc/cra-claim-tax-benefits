const crypto = require('crypto')

const config = {
  initialSalt: 'd75535de98ecea315854491c8d036f8f',
  iterations: 100000,
  hashBytes: 32,
  digest: 'sha512',
}

const hashArgs = [config.iterations, config.hashBytes, config.digest]

const hashString = (stringToHash, useInitialSalt) => {
  if (!stringToHash) {
    return Promise.reject('you need to enter a string to hash')
  }

  const salt = useInitialSalt ? config.initialSalt : crypto.randomBytes(16).toString('hex')

  const hash = crypto.pbkdf2Sync(stringToHash, salt, ...hashArgs).toString('hex')
  return [salt, hash].join('$')
}

const verifyHash = (stringToVerify, original, useInitialSalt) => {
  const originalHash = original.split('$')[1]

  const salt = useInitialSalt ? config.initialSalt : original.split('$')[0]

  const hash = crypto.pbkdf2Sync(stringToVerify, salt, ...hashArgs).toString('hex')

  return hash === originalHash
}

module.exports = {
  hashString,
  verifyHash,
}
