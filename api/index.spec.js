const API = require('./index')

test('returns expected user with correct login.code', () => {
  const user = API.getUser('A5G98S4K1')
  expect(user).not.toBe(null)
  expect(user.personal.firstName).toBe('Gabrielle')
  expect(user.personal.lastName).toBe('Roy')
})

test('returns null with a nonexistent login.code', () => {
  const user = API.getUser('H3LLY34H')
  expect(user).toBe(null)
})

test('returns matching login code as an array', () => {
  const codes = API.getMatches()
  expect(codes).toBeInstanceOf(Array)
  expect(codes.length).toBe(1)
})
