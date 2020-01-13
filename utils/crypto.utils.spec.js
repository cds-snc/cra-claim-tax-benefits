const { hashString, verifyHash } = require('./crypto.utils')

describe('Test hashString', () => {

  test('hashes using initialSalt', async () => {
    const hashed = hashString('1977-05-05', true)
    expect(hashed.length).toBe(97)
    expect(hashed).toEqual(expect.not.stringMatching('1977-05-05'))
    expect(hashed.split('$')[0]).toEqual('d75535de98ecea315854491c8d036f8f')
  })

  test('returns a rejected promise without a string', async () => {
    const hashed = hashString()

    hashed.catch((e) => {
      expect(e).toEqual('you need to enter a string to hash')
    })
  })

  test('hashes using randomly generated salt', async () => {
    const hashed = hashString('1977-05-05')
    expect(hashed.length).toBe(97)
    expect(hashed).toEqual(expect.not.stringMatching('1977-05-05'))
    expect(hashed.split('$')[0]).toEqual(expect.not.stringMatching('d75535de98ecea315854491c8d036f8f'))
  })

})

describe('Test verifyHash', () => {
  const hashed = hashString('1977-05-05')

  test('returns true when the string matches the hashed value', async () => {
    expect(verifyHash('1977-05-05', hashed)).toBe(true)
  })

  test('returns false when the string does not match the hashed value', async () => {
    expect(verifyHash('1987-05-05', hashed)).toBe(false)
  })
})
