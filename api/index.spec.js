const { API } = require('./index')

test('returns expected user with correct login.code', () => {
  const user = API.getUser('A5G98S4K1')
  expect(user).not.toBe(null)
  expect(user.personal.firstName).toEqual('Gabrielle')
  expect(user.personal.lastName).toEqual('Roy')
})

test('returns expected user with correct login.code lowercased', () => {
  const user = API.getUser('a5g98s4k1')
  expect(user).not.toBe(null)
  expect(user.personal.firstName).toEqual('Gabrielle')
  expect(user.personal.lastName).toEqual('Roy')
})

test('returns null with a nonexistent login.code', () => {
  const user = API.getUser('H3LLY34H')
  expect(user).toBe(null)
})

test('returns matching login code as an array', () => {
  const codes = API.getMatches()
  expect(codes).toBeInstanceOf(Array)
  expect(codes.length).toBe(2)
})

test('returns matching login codes as uppercase and lowercase', () => {
  const codes = API.getMatches()
  expect(codes[0]).toEqual('a5g98s4k1')
  expect(codes[1]).toEqual('A5G98S4K1')
})
